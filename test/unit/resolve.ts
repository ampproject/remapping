import { resolve } from '../../src/resolve';

describe('resolve', () => {
  describe('without base', () => {
    describe(`base = ""`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('foo/main.js.map');
        });
      });
    });
  });

  describe('with absolute base', () => {
    describe(`base = "https://foo.com"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = 'https://foo.com';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = 'https://foo.com';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = 'https://foo.com';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'https://foo.com';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = 'https://foo.com';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = 'https://foo.com';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'https://foo.com';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = 'https://foo.com';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/foo/main.js.map');
        });
      });
    });

    describe(`base = "https://foo.com/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = 'https://foo.com/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = 'https://foo.com/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = 'https://foo.com/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'https://foo.com/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = 'https://foo.com/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = 'https://foo.com/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'https://foo.com/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = 'https://foo.com/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/foo/main.js.map');
        });
      });
    });

    describe(`base = "https://foo.com/dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = 'https://foo.com/dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = 'https://foo.com/dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = 'https://foo.com/dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'https://foo.com/dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = 'https://foo.com/dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = 'https://foo.com/dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'https://foo.com/dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = 'https://foo.com/dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "https://foo.com/deep/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = 'https://foo.com/deep/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/deep/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/deep/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/deep/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/deep/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = 'https://foo.com/deep/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/deep/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/deep/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/deep/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/deep/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = 'https://foo.com/deep/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/deep/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/deep/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/deep/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/deep/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'https://foo.com/deep/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/deep/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = 'https://foo.com/deep/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = 'https://foo.com/deep/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/deep/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/deep/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'https://foo.com/deep/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/deep/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = 'https://foo.com/deep/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/deep/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/deep/foo/main.js.map');
        });
      });
    });

    describe(`base = "https://foo.com/deep/dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = 'https://foo.com/deep/dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/deep/dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/deep/dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/deep/dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/deep/dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'https://foo.com/deep/dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/deep/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = 'https://foo.com/deep/dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/deep/dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/deep/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'https://foo.com/deep/dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = 'https://foo.com/deep/dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'https://foo.com/deep/dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://foo.com/deep/dir/foo/main.js.map');
        });
      });
    });
  });

  describe('with protocol relative base', () => {
    describe(`base = "//foo.com"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '//foo.com';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '//foo.com';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '//foo.com';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '//foo.com';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '//foo.com';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '//foo.com';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '//foo.com';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '//foo.com';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/foo/main.js.map');
        });
      });
    });

    describe(`base = "//foo.com/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '//foo.com/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '//foo.com/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '//foo.com/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '//foo.com/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '//foo.com/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '//foo.com/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '//foo.com/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '//foo.com/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/foo/main.js.map');
        });
      });
    });

    describe(`base = "//foo.com/dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '//foo.com/dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '//foo.com/dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '//foo.com/dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '//foo.com/dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '//foo.com/dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '//foo.com/dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '//foo.com/dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '//foo.com/dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "//foo.com/deep/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '//foo.com/deep/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/deep/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/deep/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/deep/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/deep/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '//foo.com/deep/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/deep/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/deep/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/deep/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/deep/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '//foo.com/deep/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/deep/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/deep/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/deep/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/deep/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '//foo.com/deep/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/deep/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '//foo.com/deep/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '//foo.com/deep/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/deep/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/deep/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '//foo.com/deep/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/deep/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '//foo.com/deep/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/deep/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/deep/foo/main.js.map');
        });
      });
    });

    describe(`base = "//foo.com/deep/dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '//foo.com/deep/dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/deep/dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/deep/dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/deep/dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/deep/dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '//foo.com/deep/dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/deep/dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/deep/dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/deep/dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/deep/dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '//foo.com/deep/dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/deep/dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '//foo.com/deep/dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '//foo.com/deep/dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '//foo.com/deep/dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '//foo.com/deep/dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '//foo.com/deep/dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/deep/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '//foo.com/deep/dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/deep/dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/deep/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '//foo.com/deep/dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '//foo.com/deep/dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '//foo.com/deep/dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//foo.com/deep/dir/foo/main.js.map');
        });
      });
    });
  });

  describe('with path absolute base', () => {
    describe(`base = "/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });
      });
    });

    describe(`base = "/root"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '/root';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '/root';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '/root';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '/root';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '/root';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '/root';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '/root';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '/root';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/foo/main.js.map');
        });
      });
    });

    describe(`base = "/root/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '/root/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '/root/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '/root/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '/root/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '/root/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '/root/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '/root/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '/root/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/foo/main.js.map');
        });
      });
    });

    describe(`base = "/root/dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '/root/dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root/dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root/dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root/dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '/root/dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root/dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root/dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root/dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '/root/dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root/dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root/dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root/dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '/root/dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '/root/dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '/root/dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '/root/dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '/root/dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "/root/dir/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '/root/dir/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/dir/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root/dir/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root/dir/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root/dir/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '/root/dir/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/dir/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root/dir/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root/dir/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root/dir/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '/root/dir/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/dir/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '/root/dir/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '/root/dir/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '/root/dir/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '/root/dir/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '/root/dir/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '/root/dir/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/dir/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '/root/dir/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '/root/dir/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '/root/dir/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/root/dir/foo/main.js.map');
        });
      });
    });
  });

  describe('with relative base', () => {
    describe(`base = "dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = 'dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = 'dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = 'dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = 'dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = 'dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = 'dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "dir/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = 'dir/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'dir/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'dir/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'dir/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'dir/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = 'dir/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'dir/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'dir/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'dir/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'dir/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = 'dir/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'dir/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'dir/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'dir/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'dir/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'dir/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = 'dir/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = 'dir/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'dir/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'dir/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = 'dir/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'dir/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "deep/dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = 'deep/dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'deep/dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'deep/dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'deep/dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'deep/dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = 'deep/dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'deep/dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'deep/dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'deep/dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'deep/dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = 'deep/dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'deep/dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'deep/dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'deep/dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'deep/dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'deep/dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = 'deep/dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('deep/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = 'deep/dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'deep/dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('deep/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'deep/dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = 'deep/dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'deep/dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('deep/dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "deep/dir/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = 'deep/dir/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'deep/dir/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'deep/dir/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'deep/dir/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'deep/dir/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = 'deep/dir/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'deep/dir/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'deep/dir/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'deep/dir/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'deep/dir/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = 'deep/dir/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'deep/dir/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = 'deep/dir/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = 'deep/dir/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = 'deep/dir/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'deep/dir/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = 'deep/dir/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('deep/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = 'deep/dir/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'deep/dir/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('deep/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = 'deep/dir/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = 'deep/dir/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = 'deep/dir/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('deep/dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "./dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = './dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = './dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = './dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = './dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = './dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = './dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = './dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = './dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = './dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = './dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = './dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = './dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = './dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "./dir/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = './dir/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = './dir/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './dir/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './dir/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './dir/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = './dir/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = './dir/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './dir/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './dir/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './dir/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = './dir/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = './dir/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './dir/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './dir/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './dir/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = './dir/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = './dir/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = './dir/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = './dir/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = './dir/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = './dir/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = './dir/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "./deep/dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = './deep/dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = './deep/dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './deep/dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './deep/dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './deep/dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = './deep/dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = './deep/dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './deep/dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './deep/dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './deep/dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = './deep/dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = './deep/dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './deep/dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './deep/dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './deep/dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = './deep/dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = './deep/dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./deep/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = './deep/dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = './deep/dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./deep/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = './deep/dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = './deep/dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = './deep/dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./deep/dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "./deep/dir/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = './deep/dir/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = './deep/dir/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './deep/dir/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './deep/dir/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './deep/dir/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = './deep/dir/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = './deep/dir/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './deep/dir/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './deep/dir/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './deep/dir/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = './deep/dir/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = './deep/dir/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = './deep/dir/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = './deep/dir/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = './deep/dir/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = './deep/dir/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = './deep/dir/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./deep/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = './deep/dir/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = './deep/dir/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./deep/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = './deep/dir/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = './deep/dir/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = './deep/dir/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('./deep/dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "../dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '../dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '../dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '../dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '../dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '../dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '../dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '../dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '../dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "../dir/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '../dir/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../dir/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../dir/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../dir/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../dir/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '../dir/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../dir/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../dir/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../dir/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../dir/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '../dir/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../dir/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../dir/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../dir/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../dir/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '../dir/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '../dir/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '../dir/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../dir/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '../dir/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '../dir/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../dir/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "../deep/dir"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '../deep/dir';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../deep/dir';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../deep/dir';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../deep/dir';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../deep/dir';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '../deep/dir';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../deep/dir';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../deep/dir';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../deep/dir';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../deep/dir';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '../deep/dir';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../deep/dir';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../deep/dir';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../deep/dir';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../deep/dir';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '../deep/dir';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '../deep/dir';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../deep/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '../deep/dir';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../deep/dir';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../deep/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '../deep/dir';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '../deep/dir';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../deep/dir';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../deep/dir/foo/main.js.map');
        });
      });
    });

    describe(`base = "../deep/dir/"`, () => {
      describe('with absolute input', () => {
        test('returns input', () => {
          const base = '../deep/dir/';
          const input = 'https://absolute.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../deep/dir/';
          const input = 'https://absolute.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../deep/dir/';
          const input = 'https://absolute.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../deep/dir/';
          const input = 'https://absolute.com/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../deep/dir/';
          const input = 'https://absolute.com/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('https://absolute.com/main.js.map');
        });
      });

      describe('with protocol relative input', () => {
        test('resolves relative to the base protocol', () => {
          const base = '../deep/dir/';
          const input = '//protocol-relative.com/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../deep/dir/';
          const input = '//protocol-relative.com/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../deep/dir/';
          const input = '//protocol-relative.com/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../deep/dir/';
          const input = '//protocol-relative.com/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../deep/dir/';
          const input = '//protocol-relative.com/foo/../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('//protocol-relative.com/main.js.map');
        });
      });

      describe('with absolute path input', () => {
        test('remains absolute path', () => {
          const base = '../deep/dir/';
          const input = '/assets/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/assets/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../deep/dir/';
          const input = '/foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/foo/main.js.map');
        });

        test('normalizes current directory', () => {
          const base = '../deep/dir/';
          const input = '/./main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors', () => {
          const base = '../deep/dir/';
          const input = '/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });

        test('normalizes too many parent accessors, late', () => {
          const base = '../deep/dir/';
          const input = '/foo/../../../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('/main.js.map');
        });
      });

      describe('with leading dot relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '../deep/dir/';
          const input = './bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent directory', () => {
          const base = '../deep/dir/';
          const input = '../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../deep/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory', () => {
          const base = '../deep/dir/';
          const input = '../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../deep/dir/';
          const input = './foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../deep/dir/foo/main.js.map');
        });
      });

      describe('with relative input', () => {
        test('resolves relative to current directory', () => {
          const base = '../deep/dir/';
          const input = 'bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../deep/dir/bar/main.js.map');
        });

        test('resolves relative to parent multiple directory, later', () => {
          const base = '../deep/dir/';
          const input = 'foo/../../../bar/main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../bar/main.js.map');
        });

        test('normalizes input', () => {
          const base = '../deep/dir/';
          const input = 'foo/./bar/../main.js.map';

          const resolved = resolve(input, base);
          expect(resolved).toBe('../deep/dir/foo/main.js.map');
        });
      });
    });
  });
});
