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

import buildSourceMapTree from './build-source-map-tree';
import SourceMap from './source-map';

import type { SourceMapInput, SourceMapLoader, Options } from './types';
export type {
  DecodedSourceMap,
  EditMap,
  Options,
  RawSourceMap,
  SourceMapInput,
  SourceMapLoader,
  SourceMapSegment,
} from './types';

/**
 * Traces through all the mappings in the root sourcemap, through the sources
 * (and their sourcemaps), all the way back to the original source location.
 *
 * `loader` will be called every time we encounter a source file. If it returns
 * a sourcemap, we will recurse into that sourcemap to continue the trace. If
 * it returns a falsey value, that source file is treated as an original,
 * unmodified source file.
 *
 * Pass `excludeContent` to exclude any self-containing source file content
 * from the output sourcemap.
 *
 * Pass `decodedMappings` to receive a SourceMap with decoded (instead of
 * VLQ encoded) mappings.
 */
export default function remapping(
  input: SourceMapInput | SourceMapInput[],
  loader: SourceMapLoader,
  options?: boolean | Options
): SourceMap {
  const opts =
    typeof options === 'object' ? options : { excludeContent: !!options, decodedMappings: false };
  const graph = buildSourceMapTree(input, loader, '');
  return new SourceMap(graph.traceMappings(), opts);
}
