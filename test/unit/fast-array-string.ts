import { FastStringArray, put } from '../../src/fast-string-array';

describe('FastStringArray', () => {
  describe('put()', () => {
    test('puts string in if not present', () => {
      const array = FastStringArray();

      put(array, 'test');
      expect(array.array).toEqual(['test']);
      put(array, 'test');
      expect(array.array).toEqual(['test']);

      put(array, 'foo');
      expect(array.array).toEqual(['test', 'foo']);
      put(array, 'bar');
      expect(array.array).toEqual(['test', 'foo', 'bar']);

      put(array, 'bar');
      expect(array.array).toEqual(['test', 'foo', 'bar']);
      put(array, 'foo');
      expect(array.array).toEqual(['test', 'foo', 'bar']);
    });

    test('returns index of string in array', () => {
      const array = FastStringArray();

      expect(put(array, 'test')).toBe(0);
      expect(put(array, 'foo')).toBe(1);
      expect(put(array, 'bar')).toBe(2);
    });

    test('returns original index of string in array', () => {
      const array = FastStringArray();

      put(array, 'test');
      put(array, 'foo');
      put(array, 'bar');

      expect(put(array, 'test')).toBe(0);
      expect(put(array, 'foo')).toBe(1);
      expect(put(array, 'bar')).toBe(2);
    });

    test('handles empty string', () => {
      const array = FastStringArray();

      expect(put(array, '')).toBe(0);
      expect(put(array, '')).toBe(0);
      expect(array.array).toEqual(['']);
    });
  });
});
