import { TraceMap } from '@jridgewell/trace-mapping';
import SourceMap from '../../src/source-map';
import type { DecodedSourceMap } from '../../src/types';

describe('SourceMap', () => {
  const decoded: DecodedSourceMap = {
    mappings: [[[0, 0, 0, 0]]],
    names: [],
    sources: ['file.js'],
    version: 3,
  };
  const traced = new TraceMap(decoded);
  const opts = {
    excludeContent: false,
    decodedMappings: false,
  };

  test('it is a compliant, v3 sourcemap', () => {
    const map = new SourceMap(traced, opts);
    expect(map).toHaveProperty('mappings', 'AAAA');
    expect(map).toHaveProperty('names', decoded.names);
    expect(map).toHaveProperty('sources', decoded.sources);
    expect(map).toHaveProperty('version', 3);
  });

  test('it can include a file', () => {
    const file = 'foobar.js';
    const map = new SourceMap(new TraceMap({ ...decoded, file }), opts);
    expect(map).toHaveProperty('file', file);
  });

  // TODO: support sourceRoot
  test.skip('it can include a sourceRoot', () => {
    const sourceRoot = 'https://foo.com/';
    const map = new SourceMap(new TraceMap({ ...decoded, sourceRoot }), opts);
    expect(map).toHaveProperty('sourceRoot', sourceRoot);
  });

  test('it can include a sourcesContent', () => {
    const sourcesContent = ['1 + 1'];
    const map = new SourceMap(new TraceMap({ ...decoded, sourcesContent }), opts);
    expect(map).toHaveProperty('sourcesContent', sourcesContent);
  });

  test('sourcesContent can be manually excluded', () => {
    const sourcesContent = ['1 + 1'];
    const map = new SourceMap(new TraceMap({ ...decoded, sourcesContent }), {
      ...opts,
      excludeContent: true,
    });
    expect(map).not.toHaveProperty('sourcesContent');
  });

  test('mappings can be decoded', () => {
    const sourcesContent = ['1 + 1'];
    const map = new SourceMap(new TraceMap({ ...decoded, sourcesContent }), {
      ...opts,
      decodedMappings: true,
    });
    expect(map).toHaveProperty('mappings', [[[0, 0, 0, 0]]]);
  });

  describe('toString()', () => {
    test('returns the sourcemap in JSON', () => {
      const map = new SourceMap(traced, opts);
      expect(JSON.parse(map.toString())).toEqual(map);
    });
  });
});
