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

import OriginalSource from '../../src/original-source';

import type { SourceMapSegmentObject } from '../../src/types';

describe('OriginalSource', () => {
  let source: OriginalSource;

  beforeEach(() => {
    source = new OriginalSource('file.js', '1 + 1');
  });

  describe('traceLine()', () => {
    test('calls into with a line marker SourceMapSegmentObject', () => {
      const into = jest.fn<any, [SourceMapSegmentObject]>();
      source.traceLine(1, into);

      expect(into).toHaveBeenCalledTimes(1);
      expect(into).toHaveBeenCalledWith(
        expect.objectContaining({
          outputColumn: 0,
          line: 1,
          column: 0,
          name: '',
          filename: source.filename,
          content: source.content,
        })
      );
    });

    test("returns an array containing into's return value", () => {
      const segment = [0, 10, 1, 0, 3] as [number, number, number, number, number];
      const into = () => segment;

      const traced = source.traceLine(segment[2], into);

      expect(traced).toHaveLength(1);
      expect(traced[0]).toBe(segment);
    });
  });

  describe('traceSegment()', () => {
    test('returns a SourceMapSegmentObject struct of input params', () => {
      const outputColumn = Math.random();
      const line = Math.random();
      const column = Math.random();
      const name = String(Math.random());

      const traced = source.traceSegment(outputColumn, line, column, name);

      expect(traced).toMatchObject({
        outputColumn,
        line,
        column,
        name,
        filename: source.filename,
        content: source.content,
      });
    });
  });
});
