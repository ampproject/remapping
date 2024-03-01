import { GenMapping, addSegment, setIgnore, setSourceContent } from '@jridgewell/gen-mapping';
import SourceMap from '../../src/source-map';

describe('SourceMap', () => {
  const opts = {
    excludeContent: false,
    decodedMappings: false,
  };

  test('it is a compliant, v3 sourcemap', () => {
    const traced = new GenMapping();
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');

    const map = new SourceMap(traced, opts);
    expect(map).toHaveProperty('mappings', 'AAAA');
    expect(map).toHaveProperty('names', []);
    expect(map).toHaveProperty('sources', ['file.js']);
    expect(map).toHaveProperty('version', 3);
  });

  test('it can include a file', () => {
    const file = 'foobar.js';
    const traced = new GenMapping({ file });
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');

    const map = new SourceMap(traced, opts);
    expect(map).toHaveProperty('file', file);
  });

  // TODO: support sourceRoot
  test.skip('it can include a sourceRoot', () => {
    const sourceRoot = 'https://foo.com/';
    const traced = new GenMapping({ sourceRoot });
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');

    const map = new SourceMap(traced, opts);
    expect(map).toHaveProperty('sourceRoot', sourceRoot);
  });

  test('it can include a sourcesContent', () => {
    const content = '1 + 1';
    const traced = new GenMapping();
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');
    setSourceContent(traced, 'file.js', content);

    const map = new SourceMap(traced, opts);
    expect(map).toHaveProperty('sourcesContent', [content]);
  });

  test('sourcesContent can be manually excluded', () => {
    const content = '1 + 1';
    const traced = new GenMapping();
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');
    setSourceContent(traced, 'file.js', content);

    const map = new SourceMap(traced, { ...opts, excludeContent: true });
    expect(map).not.toHaveProperty('sourcesContent');
  });

  test('it can include ignoreList', () => {
    const traced = new GenMapping();
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');
    setIgnore(traced, 'file.js');

    const map = new SourceMap(traced, opts);
    expect(map).toHaveProperty('ignoreList', [0]);
  });

  test('mappings can be decoded', () => {
    const traced = new GenMapping();
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');

    const map = new SourceMap(traced, { ...opts, decodedMappings: true });
    expect(map).toHaveProperty('mappings', [[[0, 0, 0, 0]]]);
  });

  describe('toString()', () => {
    test('returns the sourcemap in JSON', () => {
      const traced = new GenMapping();
      addSegment(traced, 0, 0, 'file.js', 0, 0, '');

      const map = new SourceMap(traced, opts);
      expect(JSON.parse(map.toString())).toEqual(map);
    });
  });
});
