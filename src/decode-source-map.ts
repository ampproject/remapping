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

import { decode } from 'sourcemap-codec';
import defaults from './defaults';
import { DecodedSourceMap, RawSourceMap, SourceMapInput, SourceMapSegment } from './types';

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
  } else {
    // Clone the Line so that we can sort it. We don't want to mutate an array
    // that we don't own directly.
    mappings = mappings.map(cloneSegmentLine);
  }
  // Sort each Line's segments. There's no guarantee that segments are sorted for us,
  // and even Chrome's implementation sorts:
  // https://cs.chromium.org/chromium/src/third_party/devtools-frontend/src/front_end/sdk/SourceMap.js?l=507-508&rcl=109232bcf479c8f4ef8ead3cf56c49eb25f8c2f0
  mappings.forEach(sortSegments);

  return defaults({ mappings }, map);
}

function cloneSegmentLine(segments: SourceMapSegment[]): SourceMapSegment[] {
  return segments.slice();
}

function sortSegments(segments: SourceMapSegment[]): void {
  segments.sort(segmentComparator);
}

function segmentComparator(a: SourceMapSegment, b: SourceMapSegment): number {
  return a[0] - b[0];
}
