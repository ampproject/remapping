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

import stripFilename from '../../src/strip-filename';

describe('stripFilename', () => {
  test('returns empty string for empty string', () => {
    expect(stripFilename('')).toBe('');
  });

  test('returns empty string if no directory', () => {
    expect(stripFilename('foo')).toBe('');
  });

  test('it trims filename from directory path', () => {
    expect(stripFilename('/foo/bar/baz')).toBe('/foo/bar/');
    expect(stripFilename('/foo/bar')).toBe('/foo/');
  });

  test('it does nothing if trailing slash', () => {
    expect(stripFilename('/foo/bar/baz/')).toBe('/foo/bar/baz/');
    expect(stripFilename('/foo/bar/')).toBe('/foo/bar/');
    expect(stripFilename('/foo/')).toBe('/foo/');
    expect(stripFilename('/')).toBe('/');
  });
});
