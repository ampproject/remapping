import resolve from '../../src/resolve';

describe('resolve', () => {
  test('resolves input relative to base', () => {
    const base = 'bar/';
    const input = 'foo';

    expect(resolve(input, base)).toBe('bar/foo');
  });

  test('treats base as a directory regardless of slash', () => {
    const base = 'bar';
    const input = 'foo';

    expect(resolve(input, base)).toBe('bar/foo');
  });
});
