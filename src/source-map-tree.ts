import binarySearch from './binary-search';
import defaults from './defaults';
import FastStringArray from './fast-string-array';
import OriginalSource from './original-source';
import { DecodedSourceMap, SourceMapSegment, SourceMapSegmentObject } from './types';

type Sources = OriginalSource | SourceMapTree;

/**
 * SourceMapTree represents a single sourcemap, with the ability to trace
 * mapings into its child nodes (which may themseleves be SourceMapTrees).
 */
export default class SourceMapTree {
  map: DecodedSourceMap;
  sources: Sources[];

  constructor(map: DecodedSourceMap, sources: Sources[]) {
    this.map = map;
    this.sources = sources;
  }

  /**
   * traceMappings is only called on the root level SourceMapTree, and begins
   * the process of resolving each mapping in terms of the original source
   * files.
   */
  traceMappings(): DecodedSourceMap {
    const mappings: SourceMapSegment[][] = [];
    const names = new FastStringArray();
    const sources = new FastStringArray();
    const sourcesContent: (string | null)[] = [];
    const { mappings: rootMappings, names: rootNames } = this.map;

    for (let i = 0; i < rootMappings.length; i++) {
      const segments = rootMappings[i];
      const tracedSegments: SourceMapSegment[] = [];

      for (let j = 0; j < segments.length; j++) {
        const segment = segments[j];

        // 1-length segments only move the current generated colum, there's no
        // source information to gather from it.
        if (segment.length === 1) continue;
        const source = this.sources[segment[1]];

        const traced = source.traceSegment(
          segment[2],
          segment[3],
          segment.length === 5 ? rootNames[segment[4]] : ''
        );
        if (!traced) continue;

        // So we traced a segment down into its original source file. Now push a
        // new segment pointing to this location.
        const { column, line, name } = traced;
        const { content, filename } = traced.source;

        // Store the source location, and ensure we keep sourcesContent up to
        // date with the sources array.
        const sourceIndex = sources.put(filename);
        sourcesContent[sourceIndex] = content;

        // This looks like unnecessary duplication, but it noticably increases
        // preformance. If we were to push the nameIndex onto length-4 array, v8
        // would internally allocate 22 slots! That's 68 wasted bytes! Array
        // literals have the same capacity as their length, saving memory.
        if (name) {
          tracedSegments.push([segment[0], sourceIndex, line, column, names.put(name)]);
        } else {
          tracedSegments.push([segment[0], sourceIndex, line, column]);
        }
      }

      mappings.push(tracedSegments);
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
   * into its own child SourceMapTrees, until we find the orignal source map.
   */
  traceSegment(line: number, column: number, name: string): SourceMapSegmentObject | null {
    const { mappings, names } = this.map;

    // It's common for parent sourcemaps to have pointers to lines that have no
    // mapping (like a "//# sourceMappingURL=") at the end of the child file.
    if (line >= mappings.length) return null;

    const segments = mappings[line];
    const index = binarySearch(segments, column, segmentComparator);

    // If we can't find an segment that lines up to this column, then we can't
    // trace it further.
    if (index < 0) return null;
    const segment = segments[index];

    // 1-length segments only move the current generated colum, there's no
    // source information to gather from it.
    if (segment.length === 1) return null;
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