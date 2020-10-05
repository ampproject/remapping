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

import remapping from '../../src/remapping';
import { DecodedSourceMap, RawSourceMap } from '../../src/types';

describe('remapping', () => {
  // transform chain:
  // 1+1                  \n 1+1             \n\n  1 + 1;
  // line 0 column 0   <  line 1 column 1 <  line 2 column 2
  // transpiled.min.js <  transpiled.js   <  helloworld.js
  //                    v                  v
  //                 rawMap           transpiledMap
  //                              v
  //                        translatedMap

  // segment = output_column [, source, line, column [, name]]
  // all decoded numbers are zero-based

  const rawMap: RawSourceMap = {
    file: 'transpiled.min.js',
    // line 0, column 0 <- source 0, line 1, column 1, name 0
    mappings: 'AACCA', // [[[ 0, 0, 1, 1, 0 ]]]
    names: ['add'],
    sources: ['transpiled.js'],
    sourcesContent: ['\n 1+1'],
    version: 3,
  };
  const transpiledMap: RawSourceMap = {
    // line 1, column 1 <- source 0, line 2, column 2
    mappings: ';CAEE', // [ [], [[ 1, 0, 2, 2 ]] ]
    names: [],
    sources: ['helloworld.js'],
    sourcesContent: ['\n\n  1 + 1;'],
    version: 3,
  };
  const translatedMap: RawSourceMap = {
    file: 'transpiled.min.js',
    // line 0, column 0 <- source 0, line 2, column 2, name 0
    mappings: 'AAEEA', // [[[ 0, 0, 2, 2, 0 ]]]
    names: ['add'],
    // TODO: support sourceRoot
    // sourceRoot: '',
    sources: ['helloworld.js'],
    sourcesContent: ['\n\n  1 + 1;'],
    version: 3,
  };

  const rawMapDecoded: DecodedSourceMap = {
    ...rawMap,
    mappings: [[[0, 0, 1, 1, 0]]],
  };
  const transpiledMapDecoded: DecodedSourceMap = {
    ...transpiledMap,
    mappings: [[], [[1, 0, 2, 2]]],
  };
  const translatedMapDecoded: DecodedSourceMap = {
    ...translatedMap,
    mappings: [[[0, 0, 2, 2, 0]]],
  };

  // segments in reverse order to test `segmentsAreSorted` option
  // sort order is preserved in result
  // transform chain:
  // line 0 column 0   <  line 1 column 1 <  line 2 column 2
  // line 0 column 1   <  line 1 column 2 <  line 2 column 1
  // transpiled.min.js <  transpiled.js   <  helloworld.js
  //                    v                  v
  //                 rawMap           transpiledMap
  const rawMapDecodedReversed: DecodedSourceMap = {
    ...rawMap,
    // line 0, column 1 <- source 0, line 1, column 2, name 0
    // line 0, column 0 <- source 0, line 1, column 1
    mappings: [
      [
        [1, 0, 1, 2, 0],
        [0, 0, 1, 1],
      ],
    ],
  };
  const transpiledMapDecodedReversed: DecodedSourceMap = {
    ...transpiledMap,
    // line 1, column 2 <- source 0, line 2, column 1
    // line 1, column 1 <- source 0, line 2, column 2
    mappings: [
      [],
      [
        [2, 0, 2, 1],
        [1, 0, 2, 2],
      ],
    ],
  };
  const translatedMapDecodedReversed: DecodedSourceMap = {
    ...translatedMap,
    // line 0, column 1 <- source 0, line 2, column 1, name 0
    // line 0, column 0 <- source 0, line 2, column 2
    mappings: [
      [
        [1, 0, 2, 1, 0],
        [0, 0, 2, 2],
      ],
    ],
  };

  test('does not alter a lone sourcemap', () => {
    const map = remapping(rawMap, () => null);
    expect(map).toEqual(rawMap);
  });

  test('traces SourceMapSegments through child sourcemaps', () => {
    const map = remapping(rawMap, (name: string) => {
      if (name === 'transpiled.js') {
        return transpiledMap;
      }
    });

    expect(map).toEqual(translatedMap);
  });

  test('traces transformations through sourcemap', () => {
    const maps = [rawMap, transpiledMap];
    const map = remapping(maps, () => null);

    expect(map).toEqual(translatedMap);
  });

  test('resolves sourcemaps realtive to sourceRoot', () => {
    const sourceRoot = 'foo/';
    const map = remapping(
      {
        ...rawMap,
        sourceRoot,
      },
      (name: string) => {
        if (name.endsWith('transpiled.js')) {
          return transpiledMap;
        }
      }
    );

    expect(map).toEqual({
      ...translatedMap,
      // TODO: support sourceRoot
      // sourceRoot,
      sources: ['foo/helloworld.js'],
    });
  });

  test('resolves sourcemaps realtive to absolute sourceRoot', () => {
    const sourceRoot = 'https://foo.com/';
    const map = remapping(
      {
        ...rawMap,
        sourceRoot,
      },
      (name: string) => {
        if (name.endsWith('transpiled.js')) {
          return transpiledMap;
        }
      }
    );

    expect(map).toEqual({
      ...translatedMap,
      // TODO: support sourceRoot
      // sourceRoot,
      sources: [`${sourceRoot}helloworld.js`],
    });
  });

  test('includes null sourceContent if sourcemap has no sourcesContent', () => {
    const map = remapping(rawMap, (name: string) => {
      if (name === 'transpiled.js') {
        return {
          ...transpiledMap,
          sourcesContent: undefined,
        };
      }
    });

    expect(map).toHaveProperty('sourcesContent', [null]);
  });

  test('excludes null sourceContent if sourcemap is not self-containing', () => {
    const map = remapping(rawMap, (name: string) => {
      if (name === 'transpiled.js') {
        return {
          ...transpiledMap,
          sourcesContent: [null],
        };
      }
    });

    expect(map).toHaveProperty('sourcesContent', [null]);
  });

  test('excludes sourcesContent if `excludeContent` is set', () => {
    const map = remapping(
      rawMap,
      (name: string) => {
        if (name === 'transpiled.js') {
          return transpiledMap;
        }
      },
      {
        excludeContent: true,
      }
    );

    expect(map).not.toHaveProperty('sourcesContent');
  });

  test('returns decoded mappings if `skipEncodeMappings` is set', () => {
    const map = remapping(
      rawMap,
      (name: string) => {
        if (name === 'transpiled.js') {
          return transpiledMap;
        }
      },
      {
        skipEncodeMappings: true,
      }
    );

    expect(map).toEqual(translatedMapDecoded);
  });

  test('accepts decoded mappings as input', () => {
    const map = remapping(rawMapDecoded, (name: string) => {
      if (name === 'transpiled.js') {
        return transpiledMapDecoded;
      }
    });

    expect(map).toEqual(translatedMap);
  });

  test('skips sorting of segments if `segmentsAreSorted` is set', () => {
    const map = remapping(
      rawMapDecodedReversed,
      (name: string) => {
        if (name === 'transpiled.js') {
          return transpiledMapDecodedReversed;
        }
      },
      {
        skipEncodeMappings: true,
        segmentsAreSorted: true,
      }
    );
    expect(map).toEqual(translatedMapDecodedReversed);
  });

  test('throws error when old API is used', () => {
    try {
      remapping(
        rawMapDecoded,
        (name: string) => {
          if (name === 'transpiled.js') {
            return transpiledMapDecoded;
          }
        },
        true as any // old API
      );
      // fail
      expect(1).toEqual(0);
    } catch (error) {
      expect(error.message).toEqual('Please use the new API');
    }
  });
});
