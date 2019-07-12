import { readFileSync, writeFileSync } from 'fs';
import { RawSourceMap, SourceMapConsumer } from 'source-map';
import resorcery from '../../../src/resorcery';

function read(filename: string): string {
  return readFileSync(`${__dirname}/files/${filename}`, 'utf8');
}

describe('transpile then concatenate', () => {
  test('concated sections point to source files', () => {
    const map = read('bundle.js.map');
    const remapped = resorcery(map, file => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    const consumer = new SourceMapConsumer((remapped as unknown) as RawSourceMap);

    const foo = consumer.originalPositionFor({
      column: 11,
      line: 2,
    });
    expect(foo).toMatchObject({
      column: 18,
      line: 1,
      source: 'main.mjs',
    });

    const bar = consumer.originalPositionFor({
      column: 11,
      line: 6,
    });
    expect(bar).toMatchObject({
      column: 18,
      line: 1,
      source: 'placeholder.mjs',
    });

    const baz = consumer.originalPositionFor({
      column: 11,
      line: 13,
    });
    expect(baz).toMatchObject({
      column: 18,
      line: 5,
      source: 'main.mjs',
    });
  });

  test('inherits sourcesContent of original sources', () => {
    const map = read('bundle.js.map');
    const remapped = resorcery(map, file => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    expect(remapped.sourcesContent).toEqual([read('main.mjs'), read('placeholder.mjs')]);
  });
});
