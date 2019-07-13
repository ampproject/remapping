import { URL } from 'url';
import { dirname, resolve } from '../../src/resolve';

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

describe('resolve', () => {
  function suite(base: string): void {
    describe(`base = "${base}"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const input = 'https://absolute.com/main.js.map';
          expect(resolve(input, base)).toBe(input);
        });

        test('normalizes absolute input', () => {
          const input = 'https://absolute.com/foo/./bar/../main.js.map';
          expect(resolve(input, base)).toBe('https://absolute.com/foo/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        if (base.startsWith('https://')) {
          test('resolves relative to the base protocol', () => {
            const input = '//protocol-relative.com/main.js.map';
            expect(resolve(input, base)).toBe('https://protocol-relative.com/main.js.map');
          });
        } else {
          test('remains protocol relative', () => {
            const input = '//protocol-relative.com/main.js.map';
            expect(resolve(input, base)).toBe('//protocol-relative.com/main.js.map');
          });
        }

        test('normalizes input', () => {
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';
          const expected = '//protocol-relative.com/foo/main.js.map';
          const resolved = resolve(input, base);
          expect(resolved.slice(-expected.length)).toBe('//protocol-relative.com/foo/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const input = '/assets/main.js.map';
          const resolved = resolve(input, base);

          const { pathname } = new URL(resolved, 'https://foo.com/');
          expect(pathname).toBe(input);
        });

        test('normalizes input', () => {
          const input = '/foo/./bar/../main.js.map';
          const resolved = resolve(input, base);

          const { pathname } = new URL(resolved, 'https://foo.com/');
          expect(pathname).toBe('/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        if (base) {
          test('resolves relative to current directory', () => {
            const input = './bar/main.js.map';

            // TODO: we should assert that the base's path remains intact.
            expect(resolve(input, base).endsWith('/bar/main.js.map')).toBe(true);
          });

          test('resolves relative to parent directory', () => {
            const input = '../bar/main.js.map';

            // TODO: we should assert that the base's path shortened by one dir.
            expect(resolve(input, base).endsWith('bar/main.js.map')).toBe(true);
          });

          test('resolves relative to parent multiple directory', () => {
            const input = '../../../bar/main.js.map';

            // TODO: we should assert that the base's path shortened by three dirs.
            expect(resolve(input, base).endsWith('bar/main.js.map')).toBe(true);
          });

          test('resolves relative to parent multiple directory, later', () => {
            const input = 'foo/../../../bar/main.js.map';

            // TODO: we should assert that the base's path shortened by two dirs.
            expect(resolve(input, base).endsWith('bar/main.js.map')).toBe(true);
          });
        } else {
          test('remains relative to current directory', () => {
            const input = './bar/main.js.map';
            const resolved = resolve(input, base);
            expect(resolved).toBe(input);
          });

          test('remains relative to parent directory', () => {
            const input = '../bar/main.js.map';
            expect(resolve(input, base)).toBe(input);
          });
        }

        test('normalizes input', () => {
          const input = 'foo/./bar/../main.js.map';
          expect(resolve(input, base).endsWith('foo/main.js.map')).toBe(true);
        });
      });
    });
  }

  describe('without base', () => {
    suite('');
  });

  describe('with absolute base', () => {
    suite('https://foo.com');
    suite('https://foo.com/file');
    suite('https://foo.com/deep/');
    suite('https://foo.com/deep/file');
  });

  // We need a better resolver to pass these tests
  describe('with protocol relative base', () => {
    suite('//foo.com');
    suite('//foo.com/file');
    suite('//foo.com/deep/');
    suite('//foo.com/deep/file');
  });

  // We need a better resolver to pass these tests
  describe('with relative base', () => {
    suite('file');
    suite('deep/file');
    suite('./file');
    suite('./deep/file');
    suite('../file');
    suite('../deep/file');
  });
});
