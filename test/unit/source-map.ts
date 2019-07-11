import SourceMap from '../../src/source-map';
import {DecodedSourceMap} from '../../src/types';

describe('SourceMap', () => {
  const decoded: DecodedSourceMap = {
    mappings: [[[0, 0, 0, 0]]],
    names: [],
    sources: ['file.js'],
    version: 3,
  };

  test('it is a compliant, v3 sourcemap', () => {
    const map = new SourceMap(decoded, false);
    expect(map).toHaveProperty('mappings', 'AAAA');
    expect(map).toHaveProperty('names', decoded.names);
    expect(map).toHaveProperty('sources', decoded.sources);
    expect(map).toHaveProperty('version', 3);
  });

  test('it does not include properties missing from input', () => {
    const map = new SourceMap(decoded, false);
    expect(map).not.toHaveProperty('file');
    expect(map).not.toHaveProperty('sourceRoot');
    expect(map).not.toHaveProperty('sourcesContent');
  });

  test('it can include a file', () => {
    const file = 'foobar.js';
    const map = new SourceMap({ ...decoded, file }, false);
    expect(map).toHaveProperty('file', file);
  });

  test('it can include a sourceRoot', () => {
    const sourceRoot = 'https://foo.com/';
    const map = new SourceMap({ ...decoded, sourceRoot }, false);
    expect(map).toHaveProperty('sourceRoot', sourceRoot);
  });

  test('it can include a sourcesContent', () => {
    const sourcesContent = ['1 + 1'];
    const map = new SourceMap({ ...decoded, sourcesContent }, false);
    expect(map).toHaveProperty('sourcesContent', sourcesContent);
  });

  test('sourcesContent can be manually excluded', () => {
    const sourcesContent = ['1 + 1'];
    const map = new SourceMap({ ...decoded, sourcesContent }, true);
    expect(map).not.toHaveProperty('sourcesContent');
  });

  describe('toString()', () => {
    test('returns the sourcemap in JSON', () => {
      const map = new SourceMap(decoded, false);
      expect(JSON.parse(map.toString())).toEqual(map);
    });
  })
});