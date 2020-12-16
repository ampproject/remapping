/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import decodeSourceMap from '../../src/decode-source-map';
import type { DecodedSourceMap, RawSourceMap } from '../../src/types';

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

  describe('when sourcemap is unsorted', () => {
    const rawMap: RawSourceMap = {
      mappings: 'AAAA;EAAA,DAAA',
      names: [],
      sources: ['helloworld.js'],
      sourcesContent: [null],
      version: 3,
    };
    const jsonRawMap = JSON.stringify(rawMap);
    const decodedMap: DecodedSourceMap = {
      ...rawMap,
      mappings: [
        [[0, 0, 0, 0]],
        [
          [2, 0, 0, 0],
          [1, 0, 0, 0],
        ],
      ],
    };
    const jsonDecodedMap = JSON.stringify(decodedMap);
    const sortedMap: DecodedSourceMap = {
      ...rawMap,
      mappings: [
        [[0, 0, 0, 0]],
        [
          [1, 0, 0, 0],
          [2, 0, 0, 0],
        ],
      ],
    };

    test('parses, decodes, and sorts a JSON sourcemap', () => {
      expect(decodeSourceMap(jsonRawMap)).toEqual(sortedMap);
    });

    test('parses and sorts a Decoded JSON sourcemap', () => {
      expect(decodeSourceMap(jsonDecodedMap)).toEqual(sortedMap);
    });

    test('decodes and sorts a Raw sourcemap', () => {
      expect(decodeSourceMap(rawMap)).toEqual(sortedMap);
    });

    test('sorts a Decoded map', () => {
      const decoded = decodeSourceMap(decodedMap);
      expect(decoded).toEqual(sortedMap);
      expect(decoded.mappings[0]).toBe(decodedMap.mappings[0]);
      expect(decoded.mappings[1]).not.toBe(decodedMap.mappings[1]);
    });
  });
});
