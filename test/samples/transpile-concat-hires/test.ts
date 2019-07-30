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

import { readFileSync } from 'fs';
import { RawSourceMap, SourceMapConsumer } from 'source-map';
import remapping from '../../../src/remapping';

function read(filename: string): string {
  return readFileSync(`${__dirname}/files/${filename}`, 'utf8');
}

describe('transpile then concatenate', () => {
  test('concated sections point to source files', () => {
    const map = read('bundle.js.map');
    const remapped = remapping(map, file => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    const consumer = new SourceMapConsumer((remapped as unknown) as RawSourceMap);

    const foo = consumer.originalPositionFor({
      column: 11,
      line: 17,
    });
    expect(foo).toMatchObject({
      column: 18,
      line: 17,
      source: 'main.mjs',
    });

    const bar = consumer.originalPositionFor({
      column: 11,
      line: 36,
    });
    expect(bar).toMatchObject({
      column: 18,
      line: 17,
      source: 'placeholder.mjs',
    });

    const baz = consumer.originalPositionFor({
      column: 11,
      line: 43,
    });
    expect(baz).toMatchObject({
      column: 18,
      line: 21,
      source: 'main.mjs',
    });
  });

  test('inherits sourcesContent of original sources', () => {
    const map = read('bundle.js.map');
    const remapped = remapping(map, file => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    expect(remapped.sourcesContent).toEqual([read('main.mjs'), read('placeholder.mjs')]);
  });
});
