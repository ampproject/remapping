/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A binary search implementation that returns the index if a match is found,
 * or the negated index of where the `needle` should be inserted.
 *
 * The `comparator` callback receives both the `item` under comparison and the
 * needle we are searching for. It must return `0` if the `item` is a match,
 * any negative number if `item` is too small (and we must search after it), or
 * any positive number if the `item` is too large (and we must search before
 * it).
 *
 * If no match is found, a negated index of where to insert the `needle` is
 * returned. This negated index is guaranteed to be less than 0. To insert an
 * item, negate it (again) and splice:
 *
 * ```js
 * const array = [1, 3];
 * const needle = 2;
 * const index = binarySearch(array, needle, (item, needle) => item - needle);
 *
 * assert.equal(index, -2);
 * assert.equal(~index, 1);
 * array.splice(~index, 0, needle);
 * assert.deepEqual(array, [1, 2, 3]);
 * ```
 */
export default function binarySearch<T, S>(
  haystack: ArrayLike<T>,
  needle: S,
  comparator: (item: T, needle: S) => number
): number {
  let low = 0;
  let high = haystack.length - 1;

  while (low <= high) {
    const mid = low + ((high - low) >> 1);
    const cmp = comparator(haystack[mid], needle);

    if (cmp === 0) {
      return mid;
    }

    if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return ~low;
}
