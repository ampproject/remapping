import { decodedMappings, TraceMap } from '@jridgewell/trace-mapping';

import OriginalSource from '../../src/original-source';
import { SourceMapTree, traceMappings } from '../../src/source-map-tree';
import type { DecodedSourceMap } from '../../src/types';

describe('SourceMapTree', () => {
  describe('traceMappings()', () => {
    const sourceRoot = 'foo';
    const baseMap: DecodedSourceMap = {
      mappings: [],
      names: ['name'],
      sourceRoot,
      sources: ['child.js'],
      version: 3,
    };
    const child = new SourceMapTree(
      new TraceMap({
        mappings: [
          [
            [0, 0, 0, 0],
            [1, 0, 0, 0],
            [2, 0, 0, 0],
            [4, 0, 1, 1],
          ], // line 0
          [[1, 0, 0, 0, 0], [6]], // line 1
        ],
        names: ['child'],
        sources: ['original.js'],
        version: 3,
      }),
      [new OriginalSource(`${sourceRoot}/original.js`, '')]
    );

    test('records segment if segment is 1-length', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, 0, 0, 4], [5]]],
      };

      const tree = new SourceMapTree(new TraceMap(map), [child]);
      const traced = traceMappings(tree);
      expect(decodedMappings(traced)).toEqual([[[0, 0, 1, 1], [5]]]);
    });

    test('records segment if trace hits 1-length segment', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [
          [
            [0, 0, 0, 4],
            [5, 0, 1, 6],
          ],
        ],
      };

      const tree = new SourceMapTree(new TraceMap(map), [child]);
      const traced = traceMappings(tree);
      expect(decodedMappings(traced)).toEqual([[[0, 0, 1, 1], [5]]]);
    });

    test('skips segment if trace returns undefined', () => {
      const sourceIndex = 0;
      const line = 10; // There is no line 10 in child's mappings.
      const column = 0;
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      };

      const tree = new SourceMapTree(new TraceMap(map), [child]);
      const traced = traceMappings(tree);
      expect(decodedMappings(traced)).toEqual([]);
    });

    test('traces name if segment is 5-length', () => {
      const sourceIndex = 0;
      const line = 0;
      const column = 0;
      const nameIndex = 0;
      const name = 'name';
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column, nameIndex]]],
        names: [name],
      };

      const tree = new SourceMapTree(new TraceMap(map), [child]);
      const traced = traceMappings(tree);
      expect(decodedMappings(traced)).toEqual([[[0, 0, 0, 0, 0]]]);
      expect(traced).toMatchObject({
        names: [name],
      });
    });

    test('maps into traced segment', () => {
      const sourceIndex = 0;
      const line = 0;
      const column = 4;
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      };

      const tree = new SourceMapTree(new TraceMap(map), [child]);
      const traced = traceMappings(tree);
      expect(decodedMappings(traced)).toEqual([[[0, 0, 1, 1]]]);
    });

    test('maps into traced segment with name', () => {
      const sourceIndex = 0;
      const line = 1;
      const column = 1;
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      };

      const tree = new SourceMapTree(new TraceMap(map), [child]);
      const traced = traceMappings(tree);
      expect(decodedMappings(traced)).toEqual([[[0, 0, 0, 0, 0]]]);
      expect(traced).toMatchObject({
        names: ['child'],
      });
    });

    test('defaults decoded return map with original data', () => {
      const extras = {
        file: 'foobar.js',
        // TODO: support sourceRoot
        // sourceRoot: 'https://foobar.com/',
      };
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [],
        ...extras,
      };

      const tree = new SourceMapTree(new TraceMap(map), [child]);
      const traced = traceMappings(tree);
      expect(traced).toMatchObject(extras);
    });

    test('resolves source files realtive to sourceRoot', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, 0, 0, 0]]],
      };

      const tree = new SourceMapTree(new TraceMap(map), [child]);
      const traced = traceMappings(tree);
      expect(traced).toMatchObject({
        // TODO: support sourceRoot
        sourceRoot: undefined,
        sources: ['foo/original.js'],
      });
    });

    test('truncates mappings to the last line with segment', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, 0, 0, 0]], [], []],
        sourceRoot,
      };

      const tree = new SourceMapTree(new TraceMap(map), [child]);
      const traced = traceMappings(tree);
      expect(decodedMappings(traced)).toEqual([[[0, 0, 0, 0]]]);
    });

    test('truncates empty mappings', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[], [], []],
        sourceRoot,
      };

      const tree = new SourceMapTree(new TraceMap(map), [child]);
      const traced = traceMappings(tree);
      expect(decodedMappings(traced)).toEqual([]);
    });

    describe('redundant segments', () => {
      it('skips redundant segments on the same line', () => {
        const map: DecodedSourceMap = {
          ...baseMap,
          mappings: [
            [
              [0, 0, 0, 0],
              [1, 0, 0, 0],
            ],
          ],
        };

        const tree = new SourceMapTree(new TraceMap(map), [child]);
        const traced = traceMappings(tree);
        expect(decodedMappings(traced)).toEqual([[[0, 0, 0, 0]]]);
      });

      it('keeps redundant segments on another line', () => {
        const map: DecodedSourceMap = {
          ...baseMap,
          mappings: [[[0, 0, 0, 0]], [[0, 0, 0, 0]]],
        };

        const tree = new SourceMapTree(new TraceMap(map), [child]);
        const traced = traceMappings(tree);
        expect(decodedMappings(traced)).toEqual([[[0, 0, 0, 0]], [[0, 0, 0, 0]]]);
      });
    });
  });

  describe('originalPositionFor()', () => {
    const map: DecodedSourceMap = {
      mappings: [
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [2, 0, 0, 0],
          [4, 0, 1, 1],
        ], // line 0
        [[2, 0, 0, 0]], // line 1 - maps to line 0 col 0
        [[0]], // line 2 has 1 length segment
        [[0, 0, 0, 0, 0]], // line 3 has a name
        [
          [0, 0, 4, 0],
          [5, 0, 4, 6],
        ], // line 4 is identical to line 4 of source except col 5 was removed eg 01234567890 -> 012346789
        [[0, 0, 5, 0], [5], [6, 0, 5, 5]], // line 4 is identical to line 4 of source except a char was added at col 5 eg 01234*56789 -> 0123*456789
      ],
      names: ['name'],
      sources: ['child.js'],
      version: 3,
    };
    const tree = new SourceMapTree(new TraceMap(map), [new OriginalSource('child.js', '')]);

    test('traces LineSegments to the segment with matching generated column', () => {
      const trace = tree.originalPositionFor(0, 4, '');
      expect(trace).toMatchObject({ line: 1, column: 1 });
    });

    test('traces all generated cols on a line back to their source when source had characters removed', () => {
      const expectedCols = [0, 0, 0, 0, 0, 6, 6, 6, 6];
      for (let genCol = 0; genCol < expectedCols.length; genCol++) {
        const trace = tree.originalPositionFor(4, genCol, '');
        expect(trace).toMatchObject({ line: 4, column: expectedCols[genCol] });
      }
    });

    test('traces all generated cols on a line back to their source when source had characters added', () => {
      const expectedCols = [0, 0, 0, 0, 0, null, 5, 5, 5, 5, 5];
      for (let genCol = 0; genCol < expectedCols.length; genCol++) {
        const trace = tree.originalPositionFor(5, genCol, '');
        if (expectedCols[genCol] == null) {
          expect(trace).toBe(null);
        } else {
          expect(trace).toMatchObject({ line: 5, column: expectedCols[genCol] });
        }
      }
    });

    test('returns undefined if line is longer than mapping lines', () => {
      const trace = tree.originalPositionFor(10, 0, '');
      expect(trace).toBe(undefined);
    });

    test('returns undefined if no matching segment column', () => {
      //line 1 col 0 of generated doesn't exist in the original source
      const trace = tree.originalPositionFor(1, 0, '');
      expect(trace).toBe(undefined);
    });

    test('returns null if segment is 1-length', () => {
      const trace = tree.originalPositionFor(2, 0, '');
      expect(trace).toBe(null);
    });

    test('passes in outer name to trace', () => {
      const trace = tree.originalPositionFor(0, 0, 'foo');
      expect(trace).toMatchObject({ name: 'foo' });
    });

    test('overrides name if segment is 5-length', () => {
      const trace = tree.originalPositionFor(3, 0, 'foo');
      expect(trace).toMatchObject({ name: 'name' });
    });

    describe('tracing same line multiple times', () => {
      describe('later column', () => {
        test('returns matching segment after match', () => {
          expect(tree.originalPositionFor(0, 1, '')).not.toBe(undefined);
          const trace = tree.originalPositionFor(0, 4, '');
          expect(trace).toMatchObject({ line: 1, column: 1 });
        });

        test('returns matching segment after undefined match', () => {
          expect(tree.originalPositionFor(1, 0, '')).toBe(undefined);
          const trace = tree.originalPositionFor(1, 2, '');
          expect(trace).toMatchObject({ line: 0, column: 0 });
        });

        test('returns undefined segment segment after undefined match', () => {
          expect(tree.originalPositionFor(1, 0, '')).toBe(undefined);
          const trace = tree.originalPositionFor(1, 1, '');
          expect(trace).toBe(undefined);
        });

        test('returns matching segment after almost match', () => {
          expect(tree.originalPositionFor(4, 2, '')).not.toBe(undefined);
          const trace = tree.originalPositionFor(4, 5, '');
          expect(trace).toMatchObject({ line: 4, column: 6 });
        });
      });

      describe('earlier column', () => {
        test('returns matching segment after match', () => {
          expect(tree.originalPositionFor(0, 4, '')).not.toBe(undefined);
          const trace = tree.originalPositionFor(0, 1, '');
          expect(trace).toMatchObject({ line: 0, column: 0 });
        });

        test('returns undefined segment segment after undefined match', () => {
          expect(tree.originalPositionFor(1, 1, '')).toBe(undefined);
          const trace = tree.originalPositionFor(1, 0, '');
          expect(trace).toBe(undefined);
        });

        test('returns matching segment after almost match', () => {
          expect(tree.originalPositionFor(4, 2, '')).not.toBe(undefined);
          const trace = tree.originalPositionFor(4, 0, '');
          expect(trace).toMatchObject({ line: 4, column: 0 });
        });
      });
    });
  });
});
