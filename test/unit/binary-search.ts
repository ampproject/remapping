import binarySearch from '../../src/binary-search';

describe('binary search', () => {
  const array = [0, 2, 4, 6, 8, 10, 12, 14, 16];
  function comparator(item: number, needle: number): number {
    return item - needle;
  }

  test('returns index of match', () => {
    for (let i = 0; i < 9; i++) {
      const needle = i * 2;
      const index = binarySearch(array, needle, comparator);

      expect(index).toEqual(i);

      expect(array[index]).toEqual(needle);
    }
  });

  test('returns negated index for non-match', () => {
    // Test middles, which have a number left and right of index.
    for (let i = 1; i < 9; i++) {
      const needle = i * 2 - 1;
      const index = binarySearch(array, needle, comparator);

      expect(index).toBeLessThan(0);
      expect(~index).toEqual(i);

      expect(array[~index - 1]).toBeLessThan(needle);
      expect(array[~index]).toBeGreaterThan(needle);
    }

    // Test edges
    {
      // Too low
      const needle = -1;
      const index = binarySearch(array, needle, comparator);

      expect(index).toBeLessThan(0);
      expect(~index).toEqual(0);
      expect(array[~index]).toBeGreaterThan(needle);
    }

    {
      // Too high
      const needle = 18;
      const index = binarySearch(array, needle, comparator);

      expect(index).toBeLessThan(0);
      expect(~index).toEqual(9);
      expect(array[~index - 1]).toBeLessThan(needle);
    }
  });

  test('empty array', () => {
    const array: number[] = [];
    const needle = 1;
    const index = binarySearch(array, needle, comparator);

    expect(index).toBeLessThan(0);
    expect(~index).toEqual(0);
  });

  test('multilpe items in array returns valid matches', () => {
    const array = [1];
    const needle = 1;
    const expectedIndex = 0;

    let attempts = 0;
    for (; attempts < 10; attempts++) {
      array.push(needle);

      const index = binarySearch(array, needle, comparator);
      if (index !== expectedIndex) break;
    }

    expect(attempts).toBeLessThan(10);
  });
});
