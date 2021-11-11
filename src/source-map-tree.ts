import binarySearch from './binary-search';
import defaults from './defaults';
import FastStringArray from './fast-string-array';

import type OriginalSource from './original-source';
import type { DecodedSourceMap, SourceMapSegment, SourceMapSegmentObject } from './types';

type Sources = OriginalSource | SourceMapTree;

const INVALID_MAPPING = undefined;
const SOURCELESS_MAPPING = null;
type MappingSource = SourceMapSegmentObject | typeof INVALID_MAPPING | typeof SOURCELESS_MAPPING;

/**
 * SourceMapTree represents a single sourcemap, with the ability to trace
 * mappings into its child nodes (which may themselves be SourceMapTrees).
 */
export default class SourceMapTree {
  map: DecodedSourceMap;
  sources: Sources[];
  private lastLine: number;
  private lastColumn: number;
  private lastIndex: number;

  constructor(map: DecodedSourceMap, sources: Sources[]) {
    this.map = map;
    this.sources = sources;
    this.lastLine = 0;
    this.lastColumn = 0;
    this.lastIndex = 0;
  }

  /**
   * traceMappings is only called on the root level SourceMapTree, and begins the process of
   * resolving each mapping in terms of the original source files.
   */
  traceMappings(): DecodedSourceMap {
    const mappings: SourceMapSegment[][] = [];
    const names = new FastStringArray();
    const sources = new FastStringArray();
    const sourcesContent: (string | null)[] = [];
    const { sources: rootSources } = this;
    const { mappings: rootMappings, names: rootNames } = this.map;

    let lastLineWithSegment = -1;
    for (let i = 0; i < rootMappings.length; i++) {
      const segments = rootMappings[i];
      const tracedSegments: SourceMapSegment[] = [];
      let lastTraced: SourceMapSegment = [0];

      for (let j = 0; j < segments.length; j++) {
        const segment = segments[j];

        let traced: MappingSource = SOURCELESS_MAPPING;
        // 1-length segments only move the current generated column, there's no source information
        // to gather from it.
        if (segment.length !== 1) {
          const source = rootSources[segment[1]];
          traced = source.traceSegment(
            segment[2],
            segment[3],
            segment.length === 5 ? rootNames[segment[4]] : ''
          );

          // If the trace returned unefined, then there's no original source containing the mapping.
          // It may have returned null, in which case it's a source-less mapping that might need to
          // be preserved.
          if (traced === INVALID_MAPPING) continue;
        }

        if (traced === SOURCELESS_MAPPING) {
          if (lastTraced.length === 1) {
            // This is a consecutive source-less segment, which doesn't carry any new information.
            continue;
          }
          lastTraced = [segment[0]];
        } else {
          // So we traced a segment down into its original source file. Now push a
          // new segment pointing to this location.
          const { column, line, name } = traced;
          const { content, filename } = traced.source;

          // Store the source location, and ensure we keep sourcesContent up to
          // date with the sources array.
          const sourceIndex = sources.put(filename);
          sourcesContent[sourceIndex] = content;

          if (
            lastTraced.length !== 1 &&
            lastTraced[1] === sourceIndex &&
            lastTraced[2] === line &&
            lastTraced[3] === column
          ) {
            // This is a duplicate mapping pointing at the exact same starting point in the source
            // file. It doesn't provide any new information, and only bloats the sourcemap.
            continue;
          }

          // This looks like unnecessary duplication, but it noticeably increases performance. If we
          // were to push the nameIndex onto length-4 array, v8 would internally allocate 22 slots!
          // That's 68 wasted bytes! Array literals have the same capacity as their length, saving
          // memory.
          if (name) {
            lastTraced = [segment[0], sourceIndex, line, column, names.put(name)];
          } else {
            lastTraced = [segment[0], sourceIndex, line, column];
          }
        }

        tracedSegments.push(lastTraced);
        lastLineWithSegment = i;
      }

      mappings.push(tracedSegments);
    }

    if (mappings.length > lastLineWithSegment + 1) {
      mappings.length = lastLineWithSegment + 1;
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

  /**
   * traceSegment is only called on children SourceMapTrees. It recurses down
   * into its own child SourceMapTrees, until we find the original source map.
   */
  traceSegment(line: number, column: number, name: string): MappingSource {
    const { mappings, names } = this.map;

    // It's common for parent sourcemaps to have pointers to lines that have no
    // mapping (like a "//# sourceMappingURL=") at the end of the child file.
    if (line >= mappings.length) return INVALID_MAPPING;

    const segments = mappings[line];

    if (segments.length === 0) return INVALID_MAPPING;

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
      return INVALID_MAPPING; // we come before any mapped segment
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
    if (segment.length === 1) return SOURCELESS_MAPPING;

    const source = this.sources[segment[1]];

    // So now we can recurse down, until we hit the original source file.
    return source.traceSegment(
      segment[2],
      segment[3],
      // A child map's recorded name for this segment takes precedence over the
      // parent's mapped name. Imagine a mangler changing the name over, etc.
      segment.length === 5 ? names[segment[4]] : name
    );
  }
}

function segmentComparator(segment: SourceMapSegment, column: number): number {
  return segment[0] - column;
}
