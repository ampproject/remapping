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

describe('OriginalSource', () => {
  let source: OriginalSource;

  beforeEach(() => {
    source = new OriginalSource('file.js', '1 + 1');
  });

  describe('traceSegment()', () => {
    test('returns the same line number', () => {
      const line = Math.random();
      const column = Math.random();
      const name = String(Math.random());

      const trace = source.traceSegment(line, column, name);

      expect(trace.line).toBe(line);
    });

    test('returns the same column number', () => {
      const line = Math.random();
      const column = Math.random();
      const name = String(Math.random());

      const trace = source.traceSegment(line, column, name);

      expect(trace.column).toBe(column);
    });

    test('returns the same name', () => {
      const line = Math.random();
      const column = Math.random();
      const name = String(Math.random());

      const trace = source.traceSegment(line, column, name);

      expect(trace.name).toBe(name);
    });

    test('returns the original source itself', () => {
      const line = Math.random();
      const column = Math.random();
      const name = String(Math.random());

      const trace = source.traceSegment(line, column, name);

      expect(trace.source).toBe(source);
    });
  });
});
