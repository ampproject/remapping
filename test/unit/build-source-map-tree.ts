import buildSourceMapTree from '../../src/build-source-map-tree';
import type { DecodedSourceMap, EncodedSourceMap } from '../../src/types';

describe('buildSourceMapTree', () => {
  const rawMap: EncodedSourceMap = {
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
    expect(loader).toHaveBeenCalledWith('helloworld.js', expect.anything());
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
    expect(loader).toHaveBeenCalledWith('helloworld.js', expect.anything());
    expect(loader).toHaveBeenCalledWith('two.js', expect.anything());
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
    expect(loader).toHaveBeenCalledWith('https://foo.com/helloworld.js', expect.anything());
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
    expect(loader).toHaveBeenCalledWith('helloworld.js', expect.anything());
    expect(loader).toHaveBeenCalledWith('https://foo.com/assets/two.js', expect.anything());
    expect(loader).toHaveBeenCalledWith('https://foo.com/assets/deep/three.js', expect.anything());
  });

  describe('loader context', () => {
    describe('importer', () => {
      test('is empty for sources loaded from the root', () => {
        const loader = jest.fn();
        buildSourceMapTree(decodedMap, loader);

        expect(loader).toHaveBeenCalledTimes(1);
        expect(loader).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            importer: '',
          })
        );
      });

      test('is parent for nested sources', () => {
        const loader = jest.fn();
        loader.mockReturnValueOnce({
          ...rawMap,
          sources: ['two.js'],
        });
        buildSourceMapTree(decodedMap, loader);

        expect(loader).toHaveBeenCalledTimes(2);
        expect(loader).toHaveBeenCalledWith(
          'helloworld.js',
          expect.objectContaining({
            importer: '',
          })
        );
        expect(loader).toHaveBeenCalledWith(
          'two.js',
          expect.objectContaining({
            importer: 'helloworld.js',
          })
        );
      });
    });

    describe('depty', () => {
      test('is 1 for sources loaded from the root', () => {
        const loader = jest.fn();
        buildSourceMapTree(
          {
            ...decodedMap,
            sources: ['first.js', 'second.js'],
          },
          loader
        );

        expect(loader).toHaveBeenCalledTimes(2);
        expect(loader).toHaveBeenCalledWith(
          'first.js',
          expect.objectContaining({
            depth: 1,
          })
        );
        expect(loader).toHaveBeenCalledWith(
          'second.js',
          expect.objectContaining({
            depth: 1,
          })
        );
      });

      test('is increased for nested sources', () => {
        const loader = jest.fn();
        loader.mockReturnValueOnce({
          ...rawMap,
          sources: ['two.js'],
        });
        buildSourceMapTree(
          {
            ...decodedMap,
            sources: ['first.js', 'second.js'],
          },
          loader
        );

        expect(loader).toHaveBeenCalledTimes(3);
        expect(loader).toHaveBeenCalledWith(
          'first.js',
          expect.objectContaining({
            depth: 1,
          })
        );
        expect(loader).toHaveBeenCalledWith(
          'two.js',
          expect.objectContaining({
            depth: 2,
          })
        );
        expect(loader).toHaveBeenCalledWith(
          'second.js',
          expect.objectContaining({
            depth: 1,
          })
        );
      });
    });

    describe('source', () => {
      test('matches the loader source param', () => {
        const loader = jest.fn();
        buildSourceMapTree(decodedMap, loader);

        expect(loader).toHaveBeenCalledTimes(1);
        expect(loader).toHaveBeenCalledWith(
          'helloworld.js',
          expect.objectContaining({
            source: 'helloworld.js',
          })
        );
      });

      test('can be overridden to change source of original file', () => {
        const loader = jest.fn();
        loader.mockImplementationOnce((s, ctx) => {
          expect(s).toBe('helloworld.js');
          ctx.source = 'bar/baz.js';
        });

        const tree = buildSourceMapTree(decodedMap, loader);

        expect(tree.sources).toMatchObject([
          {
            source: 'bar/baz.js',
          },
        ]);
      });

      test('can be overridden to change resolving location', () => {
        const loader = jest.fn();
        loader.mockImplementationOnce((s, ctx) => {
          expect(s).toBe('helloworld.js');
          ctx.source = 'bar/baz.js';
          return {
            ...rawMap,
            sources: ['two.js'],
          };
        });

        const tree = buildSourceMapTree(decodedMap, loader);

        expect(tree.sources).toMatchObject([
          {
            sources: [
              {
                source: 'bar/two.js',
              },
            ],
          },
        ]);
      });
    });

    describe('content', () => {
      test('can override the sourcesContent of parent map', () => {
        const loader = jest.fn();
        loader.mockImplementationOnce((s, ctx) => {
          expect(s).toBe('helloworld.js');
          ctx.content = 'override';
        });

        const tree = buildSourceMapTree(decodedMap, loader);

        expect(tree.sources).toMatchObject([
          {
            content: 'override',
          },
        ]);
      });

      test('can override the sourcesContent of parent map', () => {
        const loader = jest.fn();
        loader.mockImplementationOnce((s, ctx) => {
          expect(s).toBe('helloworld.js');
          ctx.content = null;
        });

        const tree = buildSourceMapTree(
          {
            ...decodedMap,
            sourcesContent: ['test'],
          },
          loader
        );

        expect(tree.sources).toMatchObject([
          {
            content: null,
          },
        ]);
      });
    });
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
    expect(loader).toHaveBeenCalledWith('https://foo.com/deep/helloworld.js', expect.anything());
    expect(loader).toHaveBeenCalledWith('https://foo.com/two.js', expect.anything());
    expect(loader).toHaveBeenCalledWith('https://foo.com/assets/three.js', expect.anything());
  });

  describe('array form', () => {
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
      expect(loader).toHaveBeenCalledWith('helloworld.js', expect.anything());
    });
  });

  describe('null source', () => {
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

      expect(loader).toHaveBeenCalledWith('', expect.anything());
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

      expect(loader).toHaveBeenCalledWith('', expect.anything());
      expect(loader).toHaveBeenCalledWith('two.js', expect.anything());
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

      expect(loader).toHaveBeenCalledWith('https://foo.com/', expect.anything());
      expect(loader).toHaveBeenCalledWith('https://foo.com/two.js', expect.anything());
    });
  });
});
