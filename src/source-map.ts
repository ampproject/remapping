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

import { encode } from 'sourcemap-codec';
import { DecodedSourceMap, RawSourceMap } from './types';

/**
 * A SourceMap v3 compatible sourcemap, which only includes fields that were
 * provided to it.
 */
export default class SourceMap implements RawSourceMap {
  file?: string;
  mappings: string;
  sourceRoot?: string;
  names: string[];
  sources: string[];
  sourcesContent?: (string | null)[];
  version: 3;

  constructor(map: DecodedSourceMap, excludeContent: boolean) {
    this.version = 3; // SourceMap spec says this should be first.
    if ('file' in map) this.file = map.file;
    this.mappings = encode(map.mappings);
    this.names = map.names;

    // TODO: We first need to make all source URIs relative to the sourceRoot
    // before we can support a sourceRoot.
    // if ('sourceRoot' in map) this.sourceRoot = map.sourceRoot;

    this.sources = map.sources;
    if (!excludeContent && 'sourcesContent' in map) this.sourcesContent = map.sourcesContent;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
