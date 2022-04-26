import { decodedMap, encodedMap } from '@jridgewell/gen-mapping';

import type { GenMapping } from '@jridgewell/gen-mapping';
import type { DecodedSourceMap, EncodedSourceMap, Options } from './types';

/**
 * A SourceMap v3 compatible sourcemap, which only includes fields that were
 * provided to it.
 */
export default class SourceMap {
  declare file?: string | null;
  declare mappings: EncodedSourceMap['mappings'] | DecodedSourceMap['mappings'];
  declare sourceRoot?: string;
  declare names: string[];
  declare sources: (string | null)[];
  declare sourcesContent?: (string | null)[];
  declare version: 3;

  constructor(map: GenMapping, options: Options) {
    const out = options.decodedMappings ? decodedMap(map) : encodedMap(map);
    this.version = out.version; // SourceMap spec says this should be first.
    this.file = out.file;
    this.mappings = out.mappings;
    this.names = out.names;

    this.sourceRoot = out.sourceRoot;

    this.sources = out.sources;
    if (!options.excludeContent) this.sourcesContent = out.sourcesContent;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
