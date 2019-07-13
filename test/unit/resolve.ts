import { URL } from 'url';
import dirname from '../../src/dirname';
import { resolve } from '../../src/resolve';

describe('resolve', () => {
  function expectEndsWith(actual: string, expected: string): void {
    const sliced = actual.slice(-expected.length);
    expect(sliced).toBe(expected);
  }
  function expectContains(actual: string, expected: string): void {
    expect(actual.includes(expected)).toBe(true);
  }

  function stripOrigin(url: string): string {
    let index = 0;
    if (url.startsWith('https://')) {
      index = url.indexOf('/', 'https://'.length);
    } else if (url.startsWith('//')) {
      index = url.indexOf('/', '//'.length);
    } else {
      return url;
    }
    expect(index).toBeGreaterThan(0);
    return url.slice(index);
  }

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
          expectEndsWith(resolve(input, base), '//protocol-relative.com/foo/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const input = '/assets/main.js.map';
          const resolved = resolve(input, base);
          expect(stripOrigin(resolved)).toBe(input);
        });

        test('normalizes input', () => {
          const input = '/foo/./bar/../main.js.map';
          const resolved = resolve(input, base);
          expect(stripOrigin(resolved)).toBe('/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        if (base) {
          test('resolves relative to current directory', () => {
            const input = './bar/main.js.map';

            const resolved = resolve(input, base);
            expectEndsWith(resolved, 'bar/main.js.map');
            expectContains(resolved, base);
          });

          test('resolves relative to parent directory', () => {
            const input = '../bar/main.js.map';

            // TODO: we should assert that the base's path shortened by one dir.
            expectEndsWith(resolve(input, base), 'bar/main.js.map');
          });

          test('resolves relative to parent multiple directory', () => {
            const input = '../../../bar/main.js.map';

            // TODO: we should assert that the base's path shortened by three dirs.
            expectEndsWith(resolve(input, base), 'bar/main.js.map');
          });

          test('resolves relative to parent multiple directory, later', () => {
            const input = 'foo/../../../bar/main.js.map';

            // TODO: we should assert that the base's path shortened by two dirs.
            expectEndsWith(resolve(input, base), 'bar/main.js.map');
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

          test('remains relative to parent directory, later', () => {
            const input = 'foo/../../../bar/main.js.map';

            expectEndsWith(resolve(input, base), '../../bar/main.js.map');
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

  describe('with protocol relative base', () => {
    suite('//foo.com');
    suite('//foo.com/file');
    suite('//foo.com/deep/');
    suite('//foo.com/deep/file');
  });

  describe('with path absolute base', () => {
    suite('/');
    suite('/root');
    suite('/root/file');
  });

  describe('with relative base', () => {
    suite('file');
    suite('deep/file');
    suite('./file');
    suite('./deep/file');
    suite('../file');
    suite('../deep/file');
  });

  test('explicit base absolute path case', () => {
    expect(resolve('../foo', '/')).toBe('/foo');
  });

  test('explicit base relative path case', () => {
    expect(resolve('./foo', '')).toBe('./foo');
    expect(resolve('foo', './a')).toBe('./a/foo');
    expect(resolve('./foo', 'a')).toBe('a/foo');
  });
});
