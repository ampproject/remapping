import { type TraceMap, encodedMappings, decodedMappings } from '@jridgewell/trace-mapping';
import type { DecodedSourceMap, RawSourceMap, Options } from './types';

/**
 * A SourceMap v3 compatible sourcemap, which only includes fields that were
 * provided to it.
 */
export default class SourceMap {
  declare file?: string | null;
  declare mappings: RawSourceMap['mappings'] | DecodedSourceMap['mappings'];
  declare sourceRoot?: string;
  declare names: string[];
  declare sources: (string | null)[];
  declare sourcesContent?: (string | null)[];
  declare version: 3;

  constructor(map: TraceMap, options: Options) {
    this.version = 3; // SourceMap spec says this should be first.
    this.file = map.file;
    this.mappings = options.decodedMappings ? decodedMappings(map) : encodedMappings(map);
    this.names = map.names;

    // TODO: We first need to make all source URIs relative to the sourceRoot
    // before we can support a sourceRoot.
    // if ('sourceRoot' in map) this.sourceRoot = map.sourceRoot;

    this.sources = map.sources;
    if (!options.excludeContent && 'sourcesContent' in map) {
      this.sourcesContent = map.sourcesContent;
    }
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
