import buildSourceMapTree from '../../src/build-source-map-tree';
import { DecodedSourceMap, RawSourceMap } from '../../src/types';

describe('buildSourceMapTree', () => {
  const root = '<root>';
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
    const tree = buildSourceMapTree(jsonRawMap, root, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('parses a Decoded JSON sourcemap', () => {
    const tree = buildSourceMapTree(jsonDecodedMap, root, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('parses a Raw sourcemap', () => {
    const tree = buildSourceMapTree(rawMap, root, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('parses a Decoded sourcemap', () => {
    const tree = buildSourceMapTree(decodedMap, root, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('calls loader for any needed sourcemap', () => {
    const loader = jest.fn(() => null);
    buildSourceMapTree(decodedMap, root, loader);

    expect(loader).toHaveBeenCalledWith(decodedMap.sources[0]);
    expect(loader.mock.calls.length).toBe(1);
  });

  test('loader cannot be async', () => {
    // tslint:disable-next-line: no-any
    const loader = (): any => Promise.resolve(null);
    expect(() => {
      buildSourceMapTree(decodedMap, root, loader);
    }).toThrow();
  });

  test('creates OriginalSource if no sourcemap', () => {
    const tree = buildSourceMapTree(decodedMap, root, () => null);
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
      root,
      () => null
    );

    expect(tree.sources).toMatchObject([
      {
        content: '1 + 1',
      },
    ]);
  });

  test('creates OriginalSource with null content if no sourceContent', () => {
    const tree = buildSourceMapTree(decodedMap, root, () => null);
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
      root,
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
    const tree = buildSourceMapTree(decodedMap, root, loader);

    expect(tree).toMatchObject({
      sources: [
        {
          sources: [
            {
              filename: 'two.js',
            },
          ],
          uri: 'helloworld.js',
        },
      ],
      uri: root,
    });

    expect(loader).toHaveBeenCalledWith(decodedMap.sources[0]);
    expect(loader).toHaveBeenCalledWith('two.js');
    expect(loader.mock.calls.length).toBe(2);
  });

  test('calls loader with sourceRoot joined to source file', () => {
    const loader = jest.fn();
    loader
      .mockReturnValueOnce({
        ...rawMap,
        sourceRoot: 'https://bar.com/',
        sources: ['two.js'],
      })
      .mockReturnValue(null);

    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        sourceRoot: 'https://foo.com/',
      },
      root,
      loader
    );

    expect(tree).toMatchObject({
      sources: [
        {
          sources: [
            {
              filename: 'https://bar.com/two.js',
            },
          ],
          uri: 'https://foo.com/helloworld.js',
        },
      ],
      uri: root,
    });

    expect(loader).toHaveBeenCalledWith('https://foo.com/helloworld.js');
    expect(loader).toHaveBeenCalledWith('https://bar.com/two.js');
    expect(loader.mock.calls.length).toBe(2);
  });
});
