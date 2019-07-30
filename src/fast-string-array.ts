/**
 * Copyright 2019 Google LLC
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
 * FastStringArray acts like a `Set` (allowing only one ocurrence of a string
 * `key`), but provides the index of the `key` in the backing array.
 *
 * This is designed to allow synchronizing a second array with the contents of
 * the backing array, like how `sourcesContent[i]` is the source content
 * associated with `source[i]`, and there are never dulpicates.
 */
export default class FastStringArray {
  private indexes: { [key: string]: number };
  array: ReadonlyArray<string>;

  constructor() {
    this.indexes = Object.create(null) as { [key: string]: number };
    this.array = [];
  }

  /**
   * Puts `key` into the backing array, if it is not already present. Returns
   * the index of the `key` in the backing array.
   */
  put(key: string): number {
    const { array, indexes } = this;
    // The key may or may not be present. If it is present, it's a number.
    let index = indexes[key] as number | undefined;

    // If it's not yet present, we need to insert it and track the index in the
    // indexes.
    if (index === undefined) {
      index = indexes[key] = array.length;
      (array as string[]).push(key);
    }

    return index;
  }
}
