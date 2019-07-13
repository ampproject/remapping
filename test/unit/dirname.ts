import dirname from '../../src/dirname';

describe('dirname', () => {
  test('returns empty string for empty string', () => {
    expect(dirname('')).toBe('');
  });

  test('returns empty string if no directory', () => {
    expect(dirname('foo')).toBe('');
  });

  test('it trims filename from directory path', () => {
    expect(dirname('/foo/bar/baz')).toBe('/foo/bar');
    expect(dirname('/foo/bar')).toBe('/foo');
  });

  test('it trims filename and trailing slash from directory path', () => {
    expect(dirname('/foo/bar/baz/')).toBe('/foo/bar');
    expect(dirname('/foo/bar/')).toBe('/foo');
  });

  test('keeps path absolute if no filename', () => {
    expect(dirname('/foo')).toBe('/');
    expect(dirname('/foo/')).toBe('/');
  });

  test('keeps protocol relative if no filename', () => {
    expect(dirname('//foo')).toBe('//');
    expect(dirname('//foo/')).toBe('//');
  });

  test('single letter relative directory', () => {
    expect(dirname('a/b')).toBe('a');
    expect(dirname('a/')).toBe('');
    expect(dirname('./b')).toBe('.');
    expect(dirname('./')).toBe('');
  });
});
