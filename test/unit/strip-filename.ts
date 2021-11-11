import stripFilename from '../../src/strip-filename';

describe('stripFilename', () => {
  test('returns empty string for empty string', () => {
    expect(stripFilename('')).toBe('');
  });

  test('returns empty string if no directory', () => {
    expect(stripFilename('foo')).toBe('');
  });

  test('it trims filename from directory path', () => {
    expect(stripFilename('/foo/bar/baz')).toBe('/foo/bar/');
    expect(stripFilename('/foo/bar')).toBe('/foo/');
  });

  test('it does nothing if trailing slash', () => {
    expect(stripFilename('/foo/bar/baz/')).toBe('/foo/bar/baz/');
    expect(stripFilename('/foo/bar/')).toBe('/foo/bar/');
    expect(stripFilename('/foo/')).toBe('/foo/');
    expect(stripFilename('/')).toBe('/');
  });
});
