import { encode } from 'sourcemap-codec';

import type { DecodedSourceMap, RawSourceMap, Options } from './types';

/**
 * A SourceMap v3 compatible sourcemap, which only includes fields that were
 * provided to it.
 */
export default class SourceMap implements SourceMap {
  file?: string | null;
  mappings: RawSourceMap['mappings'] | DecodedSourceMap['mappings'];
  sourceRoot?: string;
  names: string[];
  sources: (string | null)[];
  sourcesContent?: (string | null)[];
  version: 3;

  constructor(map: DecodedSourceMap, options: Options) {
    this.version = 3; // SourceMap spec says this should be first.
    if ('file' in map) this.file = map.file;
    this.mappings = options.decodedMappings ? map.mappings : encode(map.mappings);
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
