/**
 * Copyright 2021 The AMP HTML Authors. All Rights Reserved.
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

import type { RawSourceMap } from 'source-map';
import { SourceMapConsumer } from 'source-map';
import remapping from '../../../src/remapping';

describe('null-source segement', () => {
  const original: any = {
    version: '3',
    sources: ['source.ts'],
    names: [],
    mappings: 'AAAA,qC,aACA',
    sourcesContent: ["function say(msg) {console.log(msg)};say('hello');\nprocess.exit(1);"],
  };
  const minified: any = {
    version: '3',
    sources: ['source.js'],
    names: ['say', 'msg', 'console', 'log', 'process', 'exit'],
    mappings: 'AAAA,SAASA,IAAIC,GAAMC,QAAQC,IAAIF,GAAMD,IAAI,SAASI,QAAQC,KAAK',
  };

  test('minified code keeps null-source segment', () => {
    const remapped = remapping([minified, original], () => null);
    const consumer = new SourceMapConsumer(remapped as unknown as RawSourceMap);

    const console = consumer.originalPositionFor({
      column: 20,
      line: 1,
    });
    expect(console).toMatchObject({
      column: 0,
      line: 1,
      source: 'source.ts',
    });

    const say = consumer.originalPositionFor({
      column: 38,
      line: 1,
    });
    expect(say).toMatchObject({
      column: null,
      line: null,
      source: null,
    });

    const exit = consumer.originalPositionFor({
      column: 53,
      line: 1,
    });
    expect(exit).toMatchObject({
      column: 0,
      line: 2,
      source: 'source.ts',
    });
  });

  test('null-source', () => {
    const remapped = remapping(original, () => null);
    const consumer = new SourceMapConsumer(remapped as unknown as RawSourceMap);

    const console = consumer.originalPositionFor({
      column: 20,
      line: 1,
    });
    expect(console).toMatchObject({
      column: 0,
      line: 1,
      source: 'source.ts',
    });

    const say = consumer.originalPositionFor({
      column: 38,
      line: 1,
    });
    expect(say).toMatchObject({
      column: null,
      line: null,
      source: null,
    });

    const exit = consumer.originalPositionFor({
      column: 53,
      line: 1,
    });
    expect(exit).toMatchObject({
      column: 0,
      line: 2,
      source: 'source.ts',
    });
  });
});
