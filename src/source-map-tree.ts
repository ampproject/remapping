import binarySearch from './binary-search';
import defaults from './defaults';
import FastStringArray from './fast-string-array';
import OriginalSource from './original-source';
import { DecodedSourceMap, SourceMapSegment, SourceMapSegmentObject } from './types';

export default class SourceMapTree {
  map: DecodedSourceMap;
  sources: (OriginalSource | SourceMapTree)[];
  uri: string;

  constructor(map: DecodedSourceMap, uri: string, sources: (OriginalSource | SourceMapTree)[]) {
    this.map = map;
    this.sources = sources;
    this.uri = uri;
  }

  traceMappings(): DecodedSourceMap {
    const mappings: SourceMapSegment[][] = [];
    const names = new FastStringArray();
    const sources = new FastStringArray();
    const sourcesContent: (string | null)[] = [];

    const { mappings: mapMappings, names: mapNames } = this.map;
    for (let i = 0; i < mapMappings.length; i++) {
      const segments = mapMappings[i];
      const tracedSegments: SourceMapSegment[] = [];

      for (let j = 0; j < segments.length; j++) {
        const segment = segments[j];

        if (segment.length === 1) continue;
        const source = this.sources[segment[1]];

        const traced = source.traceSegment(
          segment[2],
          segment[3],
          segment.length === 5 ? mapNames[segment[4]] : '',
          this
        );
        if (!traced) continue;

        const { column, line, name } = traced;
        const { content, filename } = traced.source;

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

  traceSegment(
    line: number,
    column: number,
    name: string,
    pointer: SourceMapTree
  ): SourceMapSegmentObject | null {
    const { mappings } = this.map;
    if (line >= mappings.length) {
      const location = JSON.stringify({ line, column }, null, 2).replace(/\n\s*/g, ' ');
      console.warn(
        `sourcemap "${pointer.uri}" pointed to invalid location ${location} in ${this.uri}`
      );
      return null;
    }

    const segments = mappings[line];
    const index = binarySearch(segments, column, segmentComparator);
    if (index < 0) return null;

    const segment = segments[index];
    if (segment.length === 1) return null;

    const source = this.sources[segment[1]];
    return source.traceSegment(
      segment[2],
      segment[3],
      segment.length === 5 ? this.map.names[segment[4]] : name,
      this
    );
  }
}

function segmentComparator(segment: SourceMapSegment, column: number): number {
  return segment[0] - column;
}
