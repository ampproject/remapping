import decodeSourceMap from '../../src/decode-source-map';
import { DecodedSourceMap, RawSourceMap } from '../../src/types';

describe('decodeSourceMap', () => {
  const rawMap: RawSourceMap = {
    mappings: 'AAAA',
    names: [],
    sources: ['helloworld.js'],
    sourcesContent: [null],
    version: 3,
  };
  const jsonRawMap = JSON.stringify(rawMap);
  const decodedMap: DecodedSourceMap = {
    ...rawMap,
    mappings: [[[0, 0, 0, 0]]],
  };
  const jsonDecodedMap = JSON.stringify(decodedMap);

  test('parses and decodes a JSON sourcemap', () => {
    expect(decodeSourceMap(jsonRawMap)).toEqual(decodedMap);
  });

  test('parses a Decoded JSON sourcemap', () => {
    expect(decodeSourceMap(jsonDecodedMap)).toEqual(decodedMap);
  });

  test('decodes a Raw sourcemap', () => {
    expect(decodeSourceMap(rawMap)).toEqual(decodedMap);
  });

  test('accepts a Decoded map', () => {
    expect(decodeSourceMap(decodedMap)).toEqual(decodedMap);
  });
});
