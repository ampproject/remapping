import { readFileSync } from 'fs';
import { RawSourceMap, SourceMapConsumer } from 'source-map';
import resorcery from '../../../src/resorcery';

function read(filename: string): string {
  return readFileSync(`${__dirname}/${filename}`, 'utf8');
}

describe('sample 1', () => {
  test('single source map does not change', () => {
    const map = read('helloworld.js.map');
    const remapped = resorcery(map, {});

    expect(remapped).toEqual(JSON.parse(map));
  });

  test('minify a transpiled source map', async () => {
    const minified = read('helloworld.min.js.map');
    const transpiled = read('helloworld.js.map');
    const remapped = resorcery(minified, {
      'helloworld.js': transpiled,
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

  test('inherits sourcesContent of original source', async () => {
    const minified = read('helloworld.min.js.map');
    const transpiled = read('helloworld.js.map');
    const remapped = resorcery(minified, {
      'helloworld.js': transpiled,
    });

    expect(remapped.sourcesContent).toEqual([read('helloworld.mjs')]);
  });
});
