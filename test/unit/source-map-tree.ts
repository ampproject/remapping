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

import OriginalSource from '../../src/original-source';
import SourceMapTree from '../../src/source-map-tree';
import { DecodedSourceMap } from '../../src/types';

describe('SourceMapTree', () => {
  describe('traceMappings()', () => {
    const sourceRoot = 'https://foobar.com';
    const baseMap: DecodedSourceMap = {
      mappings: [],
      names: ['name'],
      sourceRoot,
      sources: ['child.js'],
      version: 3,
    };
    const child = new SourceMapTree(
      {
        mappings: [
          [[0, 0, 0, 0], [1, 0, 0, 0], [2, 0, 0, 0], [4, 0, 1, 1]], // line 0
          [[1, 0, 0, 0, 0]], // line 1
        ],
        names: ['child'],
        sources: ['original.js'],
        version: 3,
      },
      [new OriginalSource(`${sourceRoot}/original.js`, '')]
    );

    test('skips segment if segment is 1-length', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0]]],
      };

      const source = new SourceMapTree(map, [child]);
      const traced = source.traceMappings();
      expect(traced.mappings).toEqual([[]]);
    });

    test('skips segment if trace returns null', () => {
      const sourceIndex = 0;
      const line = 10; // There is no line 10 in child's mappings.
      const column = 0;
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      };

      const source = new SourceMapTree(map, [child]);
      const traced = source.traceMappings();
      expect(traced.mappings).toEqual([[]]);
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

      const source = new SourceMapTree(map, [child]);
      const traced = source.traceMappings();
      expect(traced).toMatchObject({
        mappings: [[[0, 0, 0, 0, 0]]],
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

      const source = new SourceMapTree(map, [child]);
      const traced = source.traceMappings();
      expect(traced).toMatchObject({
        mappings: [[[0, 0, 1, 1]]],
      });
    });

    test('maps into traced segment with name', () => {
      const sourceIndex = 0;
      const line = 1;
      const column = 1;
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      };

      const source = new SourceMapTree(map, [child]);
      const traced = source.traceMappings();
      expect(traced).toMatchObject({
        mappings: [[[0, 0, 0, 0, 0]]],
        names: ['child'],
      });
    });

    test('defaults decoded return map with original data', () => {
      const extras = {
        file: 'foobar.js',
        mappings: [],
        sourceRoot: 'https://foobar.com/',
      };
      const map: DecodedSourceMap = {
        ...baseMap,
        ...extras,
      };

      const source = new SourceMapTree(map, [child]);
      const traced = source.traceMappings();
      expect(traced).toMatchObject(extras);
    });

    // TODO: support sourceRoot
    test.skip('resolves source files realtive to sourceRoot', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, 0, 0, 0]]],
        sourceRoot,
      };

      const source = new SourceMapTree(map, [child]);
      const traced = source.traceMappings();
      expect(traced).toMatchObject({
        sources: ['child.js'],
      });
    });
  });

  describe('traceSegment()', () => {
    const map: DecodedSourceMap = {
      mappings: [
        [[0, 0, 0, 0], [1, 0, 0, 0], [2, 0, 0, 0], [4, 0, 1, 1]], // line 0
        [[1, 0, 0, 0]], // line 1
        [[0]], // line 2
        [[0, 0, 0, 0, 0]], // line 3
      ],
      names: ['name'],
      sources: ['child.js'],
      version: 3,
    };
    const source = new SourceMapTree(map, [new OriginalSource('child.js', '')]);

    test('traces LineSegments to the segment with matching generated column', () => {
      const trace = source.traceSegment(0, 4, '');
      expect(trace).toMatchObject({ line: 1, column: 1 });
    });

    test('returns null if line is longer than mapping lines', () => {
      const trace = source.traceSegment(10, 0, '');
      expect(trace).toBe(null);
    });

    test('returns null if no matching segment column', () => {
      const trace = source.traceSegment(1, 0, '');
      expect(trace).toBe(null);
    });

    test('returns null if segment is 1-length', () => {
      const trace = source.traceSegment(2, 0, '');
      expect(trace).toBe(null);
    });

    test('passes in outer name to trace', () => {
      const trace = source.traceSegment(0, 0, 'foo');
      expect(trace).toMatchObject({ name: 'foo' });
    });

    test('overrides name if segment is 5-length', () => {
      const trace = source.traceSegment(3, 0, 'foo');
      expect(trace).toMatchObject({ name: 'name' });
    });
  });
});
