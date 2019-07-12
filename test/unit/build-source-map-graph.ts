import buildSourceMapGraph from '../../src/build-source-map-graph';
import { DecodedSourceMap, RawSourceMap } from '../../src/types';

describe('buildSourceMapGraph', () => {
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
    const tree = buildSourceMapGraph(jsonRawMap, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('parses a Decoded JSON sourcemap', () => {
    const tree = buildSourceMapGraph(jsonDecodedMap, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('parses a Raw sourcemap', () => {
    const tree = buildSourceMapGraph(rawMap, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('parses a Decoded sourcemap', () => {
    const tree = buildSourceMapGraph(decodedMap, () => null);
    expect(tree.map).toEqual(decodedMap);
  });

  test('calls loader for any needed sourcemap', () => {
    const loader = jest.fn(() => null);
    buildSourceMapGraph(decodedMap, loader);

    expect(loader).toHaveBeenCalledWith(decodedMap.sources[0]);
    expect(loader.mock.calls.length).toBe(1);
  });

  test('loader cannot be async', () => {
    // tslint:disable-next-line: no-any
    const loader = (): any => Promise.resolve(null);
    expect(() => {
      buildSourceMapGraph(decodedMap, loader);
    }).toThrow();
  });

  test('creates OriginalSource if no sourcemap', () => {
    const tree = buildSourceMapGraph(decodedMap, () => null);
    expect(tree.sources).toMatchObject([
      {
        filename: 'helloworld.js',
      },
    ]);
  });

  test('creates OriginalSource with sourceContent', () => {
    const tree = buildSourceMapGraph(
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
    const tree = buildSourceMapGraph(decodedMap, () => null);
    expect(tree.sources).toMatchObject([
      {
        content: null,
      },
    ]);
  });

  test('creates OriginalSource with null content if no sourcesContent', () => {
    const tree = buildSourceMapGraph(
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
    const tree = buildSourceMapGraph(decodedMap, loader);

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

    expect(loader).toHaveBeenCalledWith(decodedMap.sources[0]);
    expect(loader).toHaveBeenCalledWith('two.js');
    expect(loader.mock.calls.length).toBe(2);
  });

  test('calls loader with sourceRoot joined to source file', () => {
    const loader = jest.fn(() => null);
    buildSourceMapGraph(
      {
        ...decodedMap,
        sourceRoot: 'https://foo.com/',
      },
      loader
    );

    expect(loader).toHaveBeenCalledWith('https://foo.com/helloworld.js');
    expect(loader.mock.calls.length).toBe(1);
  });
});
