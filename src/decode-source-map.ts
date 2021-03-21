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

import type { DecodedSourceMap, RawSourceMap, SourceMapInput, SourceMapSegment } from './types';

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
    mappings = sortMappings(decode(mappings), true);
  } else {
    // Clone the Line so that we can sort it. We don't want to mutate an array
    // that we don't own directly.
    mappings = sortMappings(mappings, false);
  }

  return defaults({ mappings }, map);
}

function firstUnsortedSegmentLine(mappings: SourceMapSegment[][]): number {
  for (let i = 0; i < mappings.length; i++) {
    const segments = mappings[i];
    for (let j = 1; j < segments.length; j++) {
      if (segments[j][0] < segments[j - 1][0]) {
        return i;
      }
    }
  }
  return mappings.length;
}

function sortMappings(mappings: SourceMapSegment[][], owned: boolean): SourceMapSegment[][] {
  const unosrtedIndex = firstUnsortedSegmentLine(mappings);
  if (unosrtedIndex === mappings.length) return mappings;
  if (!owned) mappings = mappings.slice();
  for (let i = unosrtedIndex; i < mappings.length; i++) {
    mappings[i] = sortSegments(mappings[i], owned);
  }
  return mappings;
}

function sortSegments(segments: SourceMapSegment[], owned: boolean): SourceMapSegment[] {
  if (!owned) segments = segments.slice();
  return segments.sort(segmentComparator);
}

function segmentComparator(a: SourceMapSegment, b: SourceMapSegment): number {
  return a[0] - b[0];
}
