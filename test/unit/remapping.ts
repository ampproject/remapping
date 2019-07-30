/**
 * Copyright 2019 Google LLC
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
import { RawSourceMap } from '../../src/types';

describe('remapping', () => {
  const rawMap: RawSourceMap = {
    file: 'transpiled.min.js',
    // 0th column of 1st line of output file translates into the 1st source
    // file, line 2, column 1, using 1st name.
    mappings: 'AACCA',
    names: ['add'],
    sources: ['transpiled.js'],
    sourcesContent: ['1+1'],
    version: 3,
  };
  const transpiledMap: RawSourceMap = {
    // 1st column of 2nd line of output file translates into the 1st source
    // file, line 3, column 2
    mappings: ';CAEE',
    names: [],
    sources: ['helloworld.js'],
    sourcesContent: ['\n\n  1 + 1;'],
    version: 3,
  };
  const translatedMap: RawSourceMap = {
    file: 'transpiled.min.js',
    // 0th column of 1st line of output file translates into the 1st source
    // file, line 3, column 2, using first name
    mappings: 'AAEEA',
    names: ['add'],
    // TODO: support sourceRoot
    // sourceRoot: '',
    sources: ['helloworld.js'],
    sourcesContent: ['\n\n  1 + 1;'],
    version: 3,
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
      true
    );

    expect(map).not.toHaveProperty('sourcesContent');
  });
});
