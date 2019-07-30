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

import { decode } from 'sourcemap-codec';
import defaults from './defaults';
import { DecodedSourceMap, RawSourceMap, SourceMapInput } from './types';

/**
 * Decodes an input sourcemap into a `DecodedSourceMap` sourcemap object.
 *
 * Valid input maps include a `DecodedSourceMap`, a `RawSourceMap`, or JSON
 * representations of either type.
 */
export default function decodeSourceMap(map: SourceMapInput): DecodedSourceMap {
  if (typeof map === 'string') {
    map = JSON.parse(map) as DecodedSourceMap | RawSourceMap;
  }

  let { mappings } = map;
  if (typeof mappings === 'string') {
    mappings = decode(mappings);
  }

  return defaults({ mappings }, map);
}
