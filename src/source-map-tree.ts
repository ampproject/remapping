/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import binarySearch from './binary-search';
import defaults from './defaults';
import FastStringArray from './fast-string-array';

import type OriginalSource from './original-source';
import type { DecodedSourceMap, SourceMapSegment, SourceMapSegmentObject } from './types';

type Source = OriginalSource | SourceMapTree;

/**
 * SourceMapTree represents a single sourcemap, with the ability to trace
 * mappings into its child nodes (which may themselves be SourceMapTrees).
 */
export default class SourceMapTree {
  declare map: DecodedSourceMap;
  declare sources: Source[];
  private declare isEdit: boolean;
  private declare lastLine: number;
  private declare lastColumn: number;
  private declare lastIndex: number;

  constructor(map: DecodedSourceMap, isEdit: boolean, sources: Source[]) {
    this.map = map;
    this.sources = sources;
    this.isEdit = isEdit;
    this.lastLine = 0;
    this.lastColumn = 0;
    this.lastIndex = 0;
  }

  /**
   * traceMappings is only called on the root level SourceMapTree, and begins
   * the process of resolving each mapping in terms of the original source
   * files.
   */
  traceMappings(): DecodedSourceMap {
    const names = new FastStringArray();
    const sources = new FastStringArray();
    const sourcesContent: (string | null)[] = [];

    function intoSegments(segment: SourceMapSegmentObject): SourceMapSegment {
      const { outputColumn, line, column, name, filename, content } = segment;
      // Store the source location, and ensure we keep sourcesContent up to
      // date with the sources array.
      const sourceIndex = sources.put(filename);
      sourcesContent[sourceIndex] = content;

      // This looks like unnecessary duplication, but it noticeably increases
      // performance. If we were to push the nameIndex onto length-4 array, v8
      // would internally allocate 22 slots! That's 68 wasted bytes! Array
      // literals have the same capacity as their length, saving memory.
      if (name) return [outputColumn, sourceIndex, line, column, names.put(name)];
      return [outputColumn, sourceIndex, line, column];
    }

    const { isEdit, sources: rootSources } = this;
    const { mappings: rootMappings, names: rootNames } = this.map;
    const mappings: SourceMapSegment[][] = [];
    let expectedOutputLine = 0;
    for (let i = 0; i < rootMappings.length; i++, expectedOutputLine++) {
      const segments = rootMappings[i];
      let segmentObjects;
      if (isEdit && isUneditedLine(expectedOutputLine, segments)) {
        // TODO
        segmentObjects = rootSources[0].traceLine(expectedOutputLine);
      } else {
        segmentObjects = traceLine(i, segments, rootSources, rootNames);
        const lastIndex = segmentObjects.length - 1;
        if (lastIndex >= 0) expectedOutputLine = segmentObjects[lastIndex].outputLine;
      }
      mappings.push(segmentObjects.map(intoSegments));
    }
    for (let i = mappings.length - 1; i >= 0; i--) {
      if (mappings[i].length > 0) break;
      mappings.pop();
    }

    // TODO: Make all sources relative to the sourceRoot.

    return defaults(
      {
        mappings,
        names: names.array,
        sources: sources.array,
        sourcesContent,
      },
      this.map
    );
  }

  traceLine(line: number): SourceMapSegmentObject[] {
    const { mappings } = this.map;
    if (line >= mappings.length) return [];
    return traceLine(line, mappings[line], this.sources, this.map.names);
  }

  /**
   * traceSegment is only called on children SourceMapTrees. It recurses down
   * into its own child SourceMapTrees, until we find the original source map.
   */
  traceSegment(
    outputLine: number,
    outputColumn: number,
    line: number,
    column: number,
    name: string
  ): SourceMapSegmentObject | null {
    const { mappings, names } = this.map;

    // It's common for parent sourcemaps to have pointers to lines that have no
    // mapping (like a "//# sourceMappingURL=") at the end of the child file.
    if (line >= mappings.length) return null;

    const segments = mappings[line];

    if (segments.length === 0) return null;

    let low = 0;
    let high = segments.length - 1;
    if (line === this.lastLine) {
      if (column >= this.lastColumn) {
        low = this.lastIndex;
      } else {
        high = this.lastIndex;
      }
    }
    let index = binarySearch(segments, column, segmentComparator, low, high);
    this.lastLine = line;
    this.lastColumn = column;

    if (index === -1) {
      this.lastIndex = index;
      return null; // we come before any mapped segment
    }

    // If we can't find a segment that lines up to this column, we use the
    // segment before.
    if (index < 0) {
      index = ~index - 1;
    }
    this.lastIndex = index;

    const segment = segments[index];

    // 1-length segments only move the current generated column, there's no
    // source information to gather from it.
    if (segment.length === 1) return null;
    const source = this.sources[segment[1]];

    // So now we can recurse down, until we hit the original source file.
    return source.traceSegment(
      outputLine,
      outputColumn,
      segment[2],
      segment[3],
      // A child map's recorded name for this segment takes precedence over the
      // parent's mapped name. Imagine a mangler changing the name over, etc.
      segment.length === 5 ? names[segment[4]] : name
    );
  }
}

// An unedited line either contains no segments, or it contains only an line marker segment.
// Line markers are the default "lowres" segment generated by magic-string, an match [0, 0, LINE, 0].
function isUneditedLine(expectedLine: number, segments: SourceMapSegment[]): boolean {
  if (segments.length === 0) return true;
  if (segments.length > 1) return false;

  const segment = segments[0];
  if (segment[0] !== 0) return false;
  // We don't need to check source, because it can't be an edit map if there's more than 1 source.
  if (segment[2] !== expectedLine) return false;
  if (segment[3] !== 0) return false;
  return true;
}

function traceLine(
  outputLine: number,
  segments: SourceMapSegment[],
  sources: Source[],
  names: string[]
): SourceMapSegmentObject[] {
  const tracedSegments: SourceMapSegmentObject[] = [];
  let lastTraced: SourceMapSegmentObject | undefined = undefined;

  for (let j = 0; j < segments.length; j++) {
    const segment = segments[j];

    // 1-length segments only move the current generated column, there's no
    // source information to gather from it.
    if (segment.length === 1) continue;
    const source = sources[segment[1]];

    const traced = source.traceSegment(
      outputLine,
      segment[0],
      segment[2],
      segment[3],
      segment.length === 5 ? names[segment[4]] : ''
    );
    if (!traced) continue;

    if (
      lastTraced &&
      lastTraced.filename === traced.filename &&
      lastTraced.line === traced.line &&
      lastTraced.column === traced.column
    ) {
      // This is a duplicate mapping pointing at the exact same starting point in the source file.
      // It doesn't provide any new information, and only bloats the sourcemap.
      continue;
    }

    lastTraced = traced;
    tracedSegments.push(traced);
  }

  return tracedSegments;
}

function segmentComparator(segment: SourceMapSegment, column: number): number {
  return segment[0] - column;
}
