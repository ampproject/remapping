import FastStringArray from '../../src/fast-string-array';

describe('FastStringArray', () => {
  let array: FastStringArray;

  beforeEach(() => {
    array = new FastStringArray();
  });

  describe('put()', () => {
    test('puts string in if not present', () => {
      array.put('test');
      expect(array.array).toEqual(['test']);
      array.put('test');
      expect(array.array).toEqual(['test']);

      array.put('foo');
      expect(array.array).toEqual(['test', 'foo']);
      array.put('bar');
      expect(array.array).toEqual(['test', 'foo', 'bar']);

      array.put('bar');
      expect(array.array).toEqual(['test', 'foo', 'bar']);
      array.put('foo');
      expect(array.array).toEqual(['test', 'foo', 'bar']);
    });

    test('returns index of string in array', () => {
      expect(array.put('test')).toBe(0);
      expect(array.put('foo')).toBe(1);
      expect(array.put('bar')).toBe(2);
    });

    test('returns original index of string in array', () => {
      array.put('test');
      array.put('foo');
      array.put('bar');

      expect(array.put('test')).toBe(0);
      expect(array.put('foo')).toBe(1);
      expect(array.put('bar')).toBe(2);
    });

    test('handles empty string', () => {
      expect(array.put('')).toBe(0);
      expect(array.put('')).toBe(0);
      expect(array.array).toEqual(['']);
    });
  });
});
