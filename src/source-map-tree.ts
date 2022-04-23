import { FastStringArray, put } from './fast-string-array';
import { presortedDecodedMap, traceSegment, decodedMappings } from '@jridgewell/trace-mapping';

import type { TraceMap } from '@jridgewell/trace-mapping';
import type { SourceMapSegment, SourceMapSegmentObject } from './types';

const INVALID_MAPPING = undefined;
const SOURCELESS_MAPPING = null;
const EMPTY_SOURCES: Sources[] = [];

type MappingSource = SourceMapSegmentObject | typeof INVALID_MAPPING | typeof SOURCELESS_MAPPING;

type OriginalSource = {
  map: TraceMap;
  sources: Sources[];
  source: string;
  content: string | null;
};

type MapSource = {
  map: TraceMap;
  sources: Sources[];
  source: string;
  content: string | null;
};

export type Sources = OriginalSource | MapSource;

function Source<M extends TraceMap | null>(
  map: TraceMap | null,
  sources: Sources[],
  source: string,
  content: string | null
): M extends null ? OriginalSource : MapSource {
  return {
    map,
    sources,
    source,
    content,
  } as any;
}

/**
 * MapSource represents a single sourcemap, with the ability to trace mappings into its child nodes
 * (which may themselves be SourceMapTrees).
 */
export function MapSource(map: TraceMap, sources: Sources[]): MapSource {
  return Source(map, sources, '', null);
}

/**
 * A "leaf" node in the sourcemap tree, representing an original, unmodified source file. Recursive
 * segment tracing ends at the `OriginalSource`.
 */
export function OriginalSource(source: string, content: string | null): OriginalSource {
  return Source(null, EMPTY_SOURCES, source, content);
}

/**
 * traceMappings is only called on the root level SourceMapTree, and begins the process of
 * resolving each mapping in terms of the original source files.
 */
export function traceMappings(tree: Sources): TraceMap {
  const mappings: SourceMapSegment[][] = [];
  const names = FastStringArray();
  const sources = FastStringArray();
  const sourcesContent: (string | null)[] = [];
  const { sources: rootSources, map } = tree;
  const rootNames = map.names;
  const rootMappings = decodedMappings(map);

  let lastLineWithSegment = -1;
  for (let i = 0; i < rootMappings.length; i++) {
    const segments = rootMappings[i];
    const tracedSegments: SourceMapSegment[] = [];

    let lastSourcesIndex = -1;
    let lastSourceLine = -1;
    let lastSourceColumn = -1;

    for (let j = 0; j < segments.length; j++) {
      const segment = segments[j];

      let traced: MappingSource = SOURCELESS_MAPPING;
      // 1-length segments only move the current generated column, there's no source information
      // to gather from it.
      if (segment.length !== 1) {
        const source = rootSources[segment[1]];
        traced = originalPositionFor(
          source,
          segment[2],
          segment[3],
          segment.length === 5 ? rootNames[segment[4]] : ''
        );

        // If the trace is invalid, then the trace ran into a sourcemap that doesn't contain a
        // respective segment into an original source.
        if (traced === INVALID_MAPPING) continue;
      }

      const genCol = segment[0];
      if (traced === SOURCELESS_MAPPING) {
        if (lastSourcesIndex === -1) {
          // This is a consecutive source-less segment, which doesn't carry any new information.
          continue;
        }
        lastSourcesIndex = lastSourceLine = lastSourceColumn = -1;
        tracedSegments.push([genCol]);
        continue;
      }

      // So we traced a segment down into its original source file. Now push a
      // new segment pointing to this location.
      const { column, line, name, content, source } = traced;

      // Store the source location, and ensure we keep sourcesContent up to
      // date with the sources array.
      const sourcesIndex = put(sources, source);
      sourcesContent[sourcesIndex] = content;

      if (
        lastSourcesIndex === sourcesIndex &&
        lastSourceLine === line &&
        lastSourceColumn === column
      ) {
        // This is a duplicate mapping pointing at the exact same starting point in the source
        // file. It doesn't carry any new information, and only bloats the sourcemap.
        continue;
      }
      lastLineWithSegment = i;
      lastSourcesIndex = sourcesIndex;
      lastSourceLine = line;
      lastSourceColumn = column;

      // This looks like unnecessary duplication, but it noticeably increases performance. If we
      // were to push the nameIndex onto length-4 array, v8 would internally allocate 22 slots!
      // That's 68 wasted bytes! Array literals have the same capacity as their length, saving
      // memory.
      tracedSegments.push(
        name
          ? [genCol, sourcesIndex, line, column, put(names, name)]
          : [genCol, sourcesIndex, line, column]
      );
    }

    mappings.push(tracedSegments);
  }

  if (mappings.length > lastLineWithSegment + 1) {
    mappings.length = lastLineWithSegment + 1;
  }

  return presortedDecodedMap(
    Object.assign({}, tree.map, {
      mappings,
      // TODO: Make all sources relative to the sourceRoot.
      sourceRoot: undefined,
      names: names.array,
      sources: sources.array,
      sourcesContent,
    })
  );
}

/**
 * originalPositionFor is only called on children SourceMapTrees. It recurses down into its own
 * child SourceMapTrees, until we find the original source map.
 */
export function originalPositionFor(
  source: Sources,
  line: number,
  column: number,
  name: string
): MappingSource {
  if (!source.map) {
    return { column, line, name, source: source.source, content: source.content };
  }

  const segment = traceSegment(source.map, line, column);

  // If we couldn't find a segment, then this doesn't exist in the sourcemap.
  if (segment == null) return INVALID_MAPPING;
  // 1-length segments only move the current generated column, there's no source information
  // to gather from it.
  if (segment.length === 1) return SOURCELESS_MAPPING;

  return originalPositionFor(
    source.sources[segment[1]],
    segment[2],
    segment[3],
    segment.length === 5 ? source.map.names[segment[4]] : name
  );
}
