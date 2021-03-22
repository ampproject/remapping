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

import type { SourceMapSegment, SourceMapSegmentObject } from './types';

/**
 * A "leaf" node in the sourcemap tree, representing an original, unmodified
 * source file. Recursive segment tracing ends at the `OriginalSource`.
 */
export default class OriginalSource {
  content: string | null;
  filename: string;

  constructor(filename: string, content: string | null) {
    this.filename = filename;
    this.content = content;
  }

  traceLine(line: number, into: (s: SourceMapSegmentObject) => SourceMapSegment): SourceMapSegment[] {
    return [into(this.traceSegment(line, line, 0, ''))];
  }

  /**
   * Tracing a `SourceMapSegment` ends when we get to an `OriginalSource`,
   * meaning this line/column location originated from this source file.
   */
  traceSegment(
    outputColumn: number,
    line: number,
    column: number,
    name: string
  ): SourceMapSegmentObject {
    return {
      outputColumn,
      line,
      column,
      name,
      filename: this.filename,
      content: this.content,
    };
  }
}
