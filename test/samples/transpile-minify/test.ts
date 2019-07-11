import { readFileSync } from 'fs';
import { RawSourceMap, SourceMapConsumer } from 'source-map';
import resorcery from '../../../src/resorcery';

function read(filename: string): string {
  return readFileSync(`${__dirname}/files/${filename}`, 'utf8');
}

describe('transpile then minify', () => {
  test('single source map does not change', () => {
    const map = read('helloworld.js.map');
    const remapped = resorcery(map, {});

    expect(remapped).toEqual(JSON.parse(map));
  });

  test('minify a transpiled source map', () => {
    const map = read('helloworld.min.js.map');
    const remapped = resorcery(map, {
      'helloworld.js': read('helloworld.js.map'),
    });

    const consumer = new SourceMapConsumer((remapped as unknown) as RawSourceMap);
    const alert = consumer.originalPositionFor({
      column: 61,
      line: 1,
    });
    expect(alert).toEqual({
      column: 20,
      line: 3,
      name: 'alert',
      source: 'helloworld.mjs',
    });
  });

  test('inherits sourcesContent of original source', () => {
    const map = read('helloworld.min.js.map');
    const remapped = resorcery(map, {
      'helloworld.js': read('helloworld.js.map'),
    });

    expect(remapped.sourcesContent).toEqual([read('helloworld.mjs')]);
  });
});
