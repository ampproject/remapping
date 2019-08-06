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
 * Creates a brand new (prototype-less) object with the enumerable-own
 * properties of `target`. Any enumerable-own properties from `source` which
 * are not present on `target` will be copied as well.
 */
export default function defaults<T, U>(target: T, source: U): T & U {
  return Object.assign(Object.create(null), source, target) as T & U;
}
