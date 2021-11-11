import { readFileSync } from 'fs';
import type { RawSourceMap } from 'source-map';
import { SourceMapConsumer } from 'source-map';
import remapping from '../../../src/remapping';

function read(filename: string): string {
  return readFileSync(`${__dirname}/files/${filename}`, 'utf8');
}

describe('transpile then concatenate', () => {
  test('concated sections point to source files', () => {
    const map = read('bundle.js.map');
    const remapped = remapping(map, (file) => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    const consumer = new SourceMapConsumer(remapped as unknown as RawSourceMap);

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
      line: 19,
      source: 'main.mjs',
    });
  });

  test('inherits sourcesContent of original sources', () => {
    const map = read('bundle.js.map');
    const remapped = remapping(map, (file) => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    expect(remapped.sourcesContent).toEqual([read('main.mjs'), read('placeholder.mjs')]);
  });
});
