import OriginalSource from '../../src/original-source';

describe('OriginalSource', () => {
  let source: OriginalSource;

  beforeEach(() => {
    source = new OriginalSource('file.js', '1 + 1');
  });

  describe('traceSegment()', () => {
    test('returns the same line number', () => {
      const line = Math.random();
      const column = Math.random();
      const name = String(Math.random());

      const trace = source.traceSegment(line, column, name);

      expect(trace.line).toBe(line);
    });

    test('returns the same column number', () => {
      const line = Math.random();
      const column = Math.random();
      const name = String(Math.random());

      const trace = source.traceSegment(line, column, name);

      expect(trace.column).toBe(column);
    });

    test('returns the same name', () => {
      const line = Math.random();
      const column = Math.random();
      const name = String(Math.random());

      const trace = source.traceSegment(line, column, name);

      expect(trace.name).toBe(name);
    });

    test('returns the original source itself', () => {
      const line = Math.random();
      const column = Math.random();
      const name = String(Math.random());

      const trace = source.traceSegment(line, column, name);

      expect(trace.source).toBe(source);
    });
  });
});
