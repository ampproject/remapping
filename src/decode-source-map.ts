import { decode } from 'sourcemap-codec';
import {
  DecodedSourceMap,
  DecodedSourceMapMap,
  RawSourceMap,
  SourceMapInput,
  SourceMapInputMap,
} from './types';

export function decodeSourceMap(map: SourceMapInput): DecodedSourceMap {
  if (typeof map === 'string') {
    map = JSON.parse(map) as DecodedSourceMap | RawSourceMap;
  }

  let { mappings } = map;
  if (typeof mappings === 'string') {
    mappings = decode(mappings);
  }

  return Object.assign({}, map, { mappings });
}

export function decodeSourceMapMap(modules: SourceMapInputMap): DecodedSourceMapMap {
  const mapped = Object.create(null);
  const keys = Object.keys(modules);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    mapped[key] = decodeSourceMap(modules[key]);
  }

  return mapped;
}
