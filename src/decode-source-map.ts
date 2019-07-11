import { decode } from 'sourcemap-codec';
import { DecodedSourceMap, RawSourceMap, SourceMapInput } from './types';

export default function decodeSourceMap(map: SourceMapInput): DecodedSourceMap {
  if (typeof map === 'string') {
    map = JSON.parse(map) as DecodedSourceMap | RawSourceMap;
  }

  let { mappings } = map;
  if (typeof mappings === 'string') {
    mappings = decode(mappings);
  }

  return Object.assign(Object.create(null), map, { mappings });
}
