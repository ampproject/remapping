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

import { readFileSync, writeFileSync } from 'fs';
import type { RawSourceMap } from 'source-map';
import { SourceMapConsumer } from 'source-map';
import remapping from '../../../src/remapping';

function read(filename: string): string {
  return readFileSync(`${__dirname}/files/${filename}`, 'utf8');
}

describe('lowres edit map', () => {
  test('concated sections point to source files', () => {
    const map = read('bundle.js.map');
    const remapped = remapping(map, (file) => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    writeFileSync('remapped.js', read('bundle.js').replace('bundle.js.map', 'remapped.js.map'));
    writeFileSync('remapped.js.map', remapped.toString());

    const consumer = new SourceMapConsumer((remapped as unknown) as RawSourceMap);

    const bar = consumer.originalPositionFor({
      column: 11,
      line: 17,
    });
    expect(bar).toMatchObject({
      column: 18,
      line: 17,
      source: 'main.mjs',
    });

    const removeStart = consumer.originalPositionFor({
      column: 2,
      line: 18,
    });
    expect(removeStart).toMatchObject({
      column: 0,
      line: 18,
      source: 'main.mjs',
    });

    const insertEnd = consumer.originalPositionFor({
      column: 1,
      line: 39,
    });
    expect(insertEnd).toMatchObject({
      column: 0,
      line: 24,
      source: 'main.mjs',
    });
  });

  test('inherits sourcesContent of original sources', () => {
    const map = read('bundle.js.map');
    const remapped = remapping(map, (file) => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    expect(remapped.sourcesContent).toEqual([read('main.mjs')]);
  });
});
