import binarySearch from '../../src/binary-search';

describe('binary search', () => {
  function comparator(item: number, needle: number): number {
    return item - needle;
  }

  test('returns index of match', () => {
    const array: number[] = [];
    for (let i = 0; i < 9; i++) {
      array.push(i * 2);
      for (let j = 0; j < array.length; j++) {
        const needle = j * 2;
        const index = binarySearch(array, needle, comparator);

        expect(index).toEqual(j);

        expect(array[index]).toEqual(needle);
      }
    }
  });

  test('returns negated index for non-match', () => {
    // Test middles, which have a number left and right of index.
    const array: number[] = [];
    for (let i = 0; i < 9; i++) {
      array.push(i * 2);
      for (let j = 0; j < array.length; j++) {
        const needle = j * 2 - 1;
        const index = binarySearch(array, needle, comparator);
        const negated = ~index;

        expect(index).toBeLessThan(0);
        expect(negated).toEqual(j);

        if (negated > 0) {
          expect(array[negated - 1]).toBeLessThan(needle);
        }
        if (negated < array.length) {
          expect(array[negated]).toBeGreaterThan(needle);
        }
      }
    }
  });

  test('needle is lower than all elements', () => {
    const array: number[] = [];
    const needle = -1;

    for (let i = 0; i < 9; i++) {
      array.push(i * 2);
      const index = binarySearch(array, needle, comparator);
      const negated = ~index;

      expect(index).toBeLessThan(0);
      expect(negated).toEqual(0);
      expect(array[negated]).toBeGreaterThan(needle);
    }
  });

  test('needle is higher than all elements', () => {
    const array: number[] = [];
    const needle = 18;

    for (let i = 0; i < 9; i++) {
      array.push(i * 2);
      const index = binarySearch(array, needle, comparator);
      const negated = ~index;

      expect(index).toBeLessThan(0);
      expect(negated).toEqual(array.length);
      expect(array[negated - 1]).toBeLessThan(needle);
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
    const array: number[] = [1];
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
