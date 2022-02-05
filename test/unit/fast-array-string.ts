import { FastStringArray, put } from '../../src/fast-string-array';

describe('FastStringArray', () => {
  let array: FastStringArray;

  beforeEach(() => {
    array = new FastStringArray();
  });

  describe('put()', () => {
    test('puts string in if not present', () => {
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
      expect(put(array, 'test')).toBe(0);
      expect(put(array, 'foo')).toBe(1);
      expect(put(array, 'bar')).toBe(2);
    });

    test('returns original index of string in array', () => {
      put(array, 'test');
      put(array, 'foo');
      put(array, 'bar');

      expect(put(array, 'test')).toBe(0);
      expect(put(array, 'foo')).toBe(1);
      expect(put(array, 'bar')).toBe(2);
    });

    test('handles empty string', () => {
      expect(put(array, '')).toBe(0);
      expect(put(array, '')).toBe(0);
      expect(array.array).toEqual(['']);
    });
  });
});
