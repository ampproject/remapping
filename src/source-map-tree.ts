import FastStringArray from './fast-string-array';

import type { TraceMap } from '@jridgewell/trace-mapping';
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
  map: TraceMap;
  sources: Sources[];

  constructor(map: TraceMap, sources: Sources[]) {
    this.map = map;
    this.sources = sources;
  }

  /**
   * traceMappings is only called on the root level SourceMapTree, and begins the process of
   * resolving each mapping in terms of the original source files.
   */
  traceMappings(): DecodedSourceMap {
    const names = new FastStringArray();
    const sources = new FastStringArray();
    const sourcesContent: (string | null)[] = [];
    const { sources: rootSources, map } = this;
    const rootNames = map.names;

    let lastGenLine = -1;
    let lastSourcesIndex = -1;
    let lastSourceLine = -1;
    let lastSourceColumn = -1;

    const mappings = map.map(trace);

    if (mappings.length > lastGenLine + 1) {
      mappings.length = lastGenLine + 1;
    }

    // TODO: Make all sources relative to the sourceRoot.

    return Object.assign({}, this.map, {
      mappings,
      names: names.array,
      sources: sources.array,
      sourcesContent,
    });

    function trace(
      genLine: number,
      genColumn: number,
      sourcesIndex: number,
      sourceLine: number,
      sourceColumn: number,
      namesIndex: number
    ): SourceMapSegment | null {
      let traced: MappingSource = SOURCELESS_MAPPING;
      // 1-length segments only move the current generated column, there's no source information
      // to gather from it.
      if (sourcesIndex !== -1) {
        const source = rootSources[sourcesIndex];
        traced = source.originalPositionFor(
          sourceLine,
          sourceColumn,
          namesIndex === -1 ? '' : rootNames[namesIndex]
        );

        // If the trace is invalid, then the trace ran into a sourcemap that doesn't contain a
        // respective segment into an original source.
        if (traced === INVALID_MAPPING) return null;
      }

      if (traced === SOURCELESS_MAPPING) {
        if (lastSourcesIndex === -1) {
          // This is a consecutive source-less segment, which doesn't carry any new information.
          return null;
        }
        lastSourcesIndex = lastSourceLine = lastSourceColumn = -1;
        return [genColumn];
      }

      // So we traced a segment down into its original source file. Now push a
      // new segment pointing to this location.
      const { column, line, name } = traced;
      const { content, filename } = traced.source;

      // Store the source location, and ensure we keep sourcesContent up to
      // date with the sources array.
      const sIndex = sources.put(filename);
      sourcesContent[sIndex] = content;

      if (
        lastGenLine === genLine &&
        lastSourcesIndex === sIndex &&
        lastSourceLine === line &&
        lastSourceColumn === column
      ) {
        // This is a duplicate mapping pointing at the exact same starting point in the source
        // file. It doesn't carry any new information, and only bloats the sourcemap.
        return null;
      }
      lastGenLine = genLine;
      lastSourcesIndex = sIndex;
      lastSourceLine = line;
      lastSourceColumn = column;

      // This looks like unnecessary duplication, but it noticeably increases performance. If we
      // were to push the nameIndex onto length-4 array, v8 would internally allocate 22 slots!
      // That's 68 wasted bytes! Array literals have the same capacity as their length, saving
      // memory.
      if (name) return [genColumn, sIndex, line, column, names.put(name)];
      return [genColumn, sIndex, line, column];
    }
  }

  /**
   * traceSegment is only called on children SourceMapTrees. It recurses down
   * into its own child SourceMapTrees, until we find the original source map.
   */
  originalPositionFor(line: number, column: number, name: string): MappingSource {
    const segment = this.map.traceSegment(line, column);

    // If we couldn't find a segment, then this doesn't exist in the sourcemap.
    if (segment == null) return INVALID_MAPPING;
    // 1-length segments only move the current generated column, there's no source information
    // to gather from it.
    if (segment.length === 1) return SOURCELESS_MAPPING;

    const source = this.sources[segment[1]];
    return source.originalPositionFor(
      segment[2],
      segment[3],
      segment.length === 5 ? this.map.names[segment[4]] : name
    );
  }
}
