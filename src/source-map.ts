import { encode } from 'sourcemap-codec';
import { DecodedSourceMap, RawSourceMap } from './types';

/**
 * A SourceMap v3 compatible sourcemap, which only includes fields that were
 * provided to it.
 */
export default class SourceMap implements RawSourceMap {
  file?: string;
  mappings: string;
  sourceRoot?: string;
  names: string[];
  sources: string[];
  sourcesContent?: (string | null)[];
  version: 3;

  constructor(map: DecodedSourceMap, excludeContent: boolean) {
    this.version = 3; // SourceMap spec says this should be first.
    if ('file' in map) this.file = map.file;
    this.mappings = encode(map.mappings);
    this.names = map.names;
    if ('sourceRoot' in map) this.sourceRoot = map.sourceRoot;
    this.sources = map.sources;
    if (!excludeContent && 'sourcesContent' in map) this.sourcesContent = map.sourcesContent;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
