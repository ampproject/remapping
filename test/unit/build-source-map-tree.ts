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

import buildSourceMapTree from '../../src/build-source-map-tree';
import { DecodedSourceMap, RawSourceMap } from '../../src/types';

describe('buildSourceMapTree', () => {
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
    const tree = buildSourceMapTree(jsonRawMap, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('parses a Decoded JSON sourcemap', () => {
    const tree = buildSourceMapTree(jsonDecodedMap, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('parses a Raw sourcemap', () => {
    const tree = buildSourceMapTree(rawMap, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('parses a Decoded sourcemap', () => {
    const tree = buildSourceMapTree(decodedMap, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('calls loader for any needed sourcemap', () => {
    const loader = jest.fn(() => null);
    buildSourceMapTree(decodedMap, loader);

    expect(loader).toHaveBeenCalledWith('helloworld.js');
    expect(loader.mock.calls.length).toBe(1);
  });

  test('loader cannot be async', () => {
    // tslint:disable-next-line: no-any
    const loader = (): any => Promise.resolve(null);
    expect(() => {
      buildSourceMapTree(decodedMap, loader);
    }).toThrow();
  });

  test('creates OriginalSource if no sourcemap', () => {
    const tree = buildSourceMapTree(decodedMap, () => null);
    expect(tree.sources).toMatchObject([
      {
        filename: 'helloworld.js',
      },
    ]);
  });

  test('creates OriginalSource with sourceContent', () => {
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        sourcesContent: ['1 + 1'],
      },
      () => null
    );

    expect(tree.sources).toMatchObject([
      {
        content: '1 + 1',
      },
    ]);
  });

  test('creates OriginalSource with null content if no sourceContent', () => {
    const tree = buildSourceMapTree(decodedMap, () => null);
    expect(tree.sources).toMatchObject([
      {
        content: null,
      },
    ]);
  });

  test('creates OriginalSource with null content if no sourcesContent', () => {
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        sourcesContent: undefined,
      },
      () => null
    );

    expect(tree.sources).toMatchObject([
      {
        content: null,
      },
    ]);
  });

  test('recursively loads sourcemaps', () => {
    const loader = jest.fn();
    loader
      .mockReturnValueOnce({
        ...rawMap,
        sources: ['two.js'],
      })
      .mockReturnValue(null);
    const tree = buildSourceMapTree(decodedMap, loader);

    expect(tree).toMatchObject({
      sources: [
        {
          sources: [
            {
              filename: 'two.js',
            },
          ],
        },
      ],
    });

    expect(loader).toHaveBeenCalledWith('helloworld.js');
    expect(loader).toHaveBeenCalledWith('two.js');
    expect(loader.mock.calls.length).toBe(2);
  });

  test('calls loader with sourceRoot joined to source file', () => {
    const loader = jest.fn(() => null);
    buildSourceMapTree(
      {
        ...decodedMap,
        sourceRoot: 'https://foo.com/',
      },
      loader
    );

    expect(loader).toHaveBeenCalledWith('https://foo.com/helloworld.js');
    expect(loader.mock.calls.length).toBe(1);
  });

  test('original sources are relative to the tree path', () => {
    const loader = jest.fn();
    loader
      .mockReturnValueOnce({
        ...rawMap,
        file: 'helloworld.js',
        sourceRoot: 'https://foo.com/',
        sources: ['./assets/two.js'],
      })
      .mockReturnValueOnce({
        ...rawMap,
        file: 'two.js',
        // We need to support relative roots...
        // sourceRoot: './deep/',
        sources: ['three.js'],
      })
      .mockReturnValue(null);
    const tree = buildSourceMapTree(decodedMap, loader);

    expect(tree).toMatchObject({
      // Root map
      sources: [
        {
          // helloworld.js's map
          sources: [
            {
              // two.js's map
              sources: [
                {
                  filename: 'https://foo.com/assets/three.js',
                },
              ],
            },
          ],
        },
      ],
    });

    expect(loader).toHaveBeenCalledWith('helloworld.js');
    expect(loader).toHaveBeenCalledWith('https://foo.com/assets/two.js');
    expect(loader).toHaveBeenCalledWith('https://foo.com/assets/three.js');
    expect(loader.mock.calls.length).toBe(3);
  });

  test('original sources are relative to the tree path, edge cases', () => {
    const loader = jest.fn();
    loader
      .mockReturnValueOnce({
        ...rawMap,
        file: 'helloworld.js',
        sources: ['/two.js'],
      })
      .mockReturnValueOnce({
        ...rawMap,
        file: 'two.js',
        // We need to support relative roots...
        // sourceRoot: './assets/',
        sources: ['./assets/three.js'],
      })
      .mockReturnValue(null);
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        // We shouldn't need this, but we need absolute URLs because our resolver
        // sucks.
        sourceRoot: 'https://foo.com/deep',
      },
      loader
    );

    expect(tree).toMatchObject({
      // Root map
      sources: [
        {
          // helloworld.js's map
          sources: [
            {
              // two.js's map
              sources: [
                {
                  filename: 'https://foo.com/assets/three.js',
                },
              ],
            },
          ],
        },
      ],
    });

    expect(loader).toHaveBeenCalledWith('https://foo.com/deep/helloworld.js');
    expect(loader).toHaveBeenCalledWith('https://foo.com/two.js');
    expect(loader).toHaveBeenCalledWith('https://foo.com/assets/three.js');
    expect(loader.mock.calls.length).toBe(3);
  });

  test('transformation maps of a sourcemap may be passed before the sourcemap', () => {
    const maps = [
      decodedMap, // "transformation map"
      decodedMap,
    ];
    const tree = buildSourceMapTree(maps, () => null);

    expect(tree).toMatchObject({
      // Transformation map
      sources: [
        {
          // helloworld.js's map
          sources: [
            {
              filename: 'helloworld.js',
            },
          ],
        },
      ],
    });
  });

  test('throws when transformation map has more than one source', () => {
    const maps = [
      {
        ...decodedMap,
        sources: ['one.js', 'two.js'],
      }, // "transformation map"
      decodedMap,
    ];
    expect(() => {
      buildSourceMapTree(maps, () => null);
    }).toThrow();
  });
});
