import buildSourceMapTree from '../../src/build-source-map-tree';
import type { DecodedSourceMap, RawSourceMap } from '../../src/types';

describe('buildSourceMapTree', () => {
  const rawMap: RawSourceMap = {
    mappings: 'AAAA',
    names: [],
    sources: ['helloworld.js'],
    sourcesContent: [null],
    version: 3,
  };
  const decodedMap: DecodedSourceMap = {
    ...rawMap,
    mappings: [[[0, 0, 0, 0]]],
  };

  test('calls loader for any needed sourcemap', () => {
    const loader = jest.fn(() => null);
    buildSourceMapTree(decodedMap, loader);

    expect(loader).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenCalledWith('helloworld.js');
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
        source: 'helloworld.js',
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

    expect(tree.sources).toMatchObject([
      {
        sources: [
          {
            source: 'two.js',
          },
        ],
      },
    ]);

    expect(loader).toHaveBeenCalledTimes(2);
    expect(loader).toHaveBeenCalledWith('helloworld.js');
    expect(loader).toHaveBeenCalledWith('two.js');
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

    expect(loader).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenCalledWith('https://foo.com/helloworld.js');
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
        sourceRoot: './deep/',
        sources: ['three.js'],
      })
      .mockReturnValue(null);
    const tree = buildSourceMapTree(decodedMap, loader);

    expect(tree.sources).toMatchObject([
      {
        // helloworld.js's map
        sources: [
          {
            // two.js's map
            sources: [
              {
                source: 'https://foo.com/assets/deep/three.js',
              },
            ],
          },
        ],
      },
    ]);

    expect(loader).toHaveBeenCalledTimes(3);
    expect(loader).toHaveBeenCalledWith('helloworld.js');
    expect(loader).toHaveBeenCalledWith('https://foo.com/assets/two.js');
    expect(loader).toHaveBeenCalledWith('https://foo.com/assets/deep/three.js');
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

    expect(tree.sources).toMatchObject([
      {
        // helloworld.js's map
        sources: [
          {
            // two.js's map
            sources: [
              {
                source: 'https://foo.com/assets/three.js',
              },
            ],
          },
        ],
      },
    ]);

    expect(loader).toHaveBeenCalledTimes(3);
    expect(loader).toHaveBeenCalledWith('https://foo.com/deep/helloworld.js');
    expect(loader).toHaveBeenCalledWith('https://foo.com/two.js');
    expect(loader).toHaveBeenCalledWith('https://foo.com/assets/three.js');
  });

  test('transformation maps of a sourcemap may be passed before the sourcemap', () => {
    const maps = [
      decodedMap, // "transformation map"
      decodedMap,
    ];
    const tree = buildSourceMapTree(maps, () => null);

    expect(tree.sources).toMatchObject([
      {
        // helloworld.js's map
        sources: [
          {
            source: 'helloworld.js',
          },
        ],
      },
    ]);
  });

  test('transformation map does not influence map url', () => {
    const maps = [
      {
        ...decodedMap,
        sourceRoot: 'https://example.com/',
      }, // "transformation map"
      decodedMap,
    ];
    const tree = buildSourceMapTree(maps, () => null);

    expect(tree.sources).toMatchObject([
      {
        // helloworld.js's map
        sources: [
          {
            source: 'helloworld.js',
          },
        ],
      },
    ]);
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

  test('handles when transformation map has 0 sources', () => {
    const maps = [
      {
        ...decodedMap,
        mappings: [],
        sources: [],
      }, // "transformation map"
      decodedMap,
    ];
    const loader = jest.fn();

    const tree = buildSourceMapTree(maps, loader);
    expect(tree.map).toMatchObject({
      sources: [],
    });
    expect(loader).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenCalledWith('helloworld.js');
  });

  test('parses map with null source', () => {
    const loader = jest.fn();
    loader
      .mockReturnValueOnce({
        ...rawMap,
        sources: ['two.js'],
      })
      .mockReturnValue(null);
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        sources: [null],
      },
      loader
    );

    expect(tree.map).toMatchObject({
      sources: [null],
    });

    expect(loader).toHaveBeenCalledWith('');
  });

  test('parses maps descending from null source', () => {
    const loader = jest.fn();
    loader
      .mockReturnValueOnce({
        ...rawMap,
        sources: ['two.js'],
      })
      .mockReturnValue(null);
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        sources: [null],
      },
      loader
    );

    expect(tree.sources).toMatchObject([
      {
        sources: [
          {
            source: 'two.js',
          },
        ],
      },
    ]);

    expect(loader).toHaveBeenCalledWith('');
    expect(loader).toHaveBeenCalledWith('two.js');
  });

  test('parses maps descending from null source with sourceRoot', () => {
    const loader = jest.fn();
    loader
      .mockReturnValueOnce({
        ...rawMap,
        sources: ['two.js'],
      })
      .mockReturnValue(null);
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        sourceRoot: 'https://foo.com/',
        sources: [null],
      },
      loader
    );

    expect(tree.sources).toMatchObject([
      {
        sources: [
          {
            source: 'https://foo.com/two.js',
          },
        ],
      },
    ]);

    expect(loader).toHaveBeenCalledWith('https://foo.com/');
    expect(loader).toHaveBeenCalledWith('https://foo.com/two.js');
  });
});
