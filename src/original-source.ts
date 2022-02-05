import type { SourceMapSegmentObject } from './types';

/**
 * A "leaf" node in the sourcemap tree, representing an original, unmodified
 * source file. Recursive segment tracing ends at the `OriginalSource`.
 */
export default class OriginalSource {
  declare content: string | null;
  declare source: string;

  constructor(source: string, content: string | null) {
    this.source = source;
    this.content = content;
  }

  /**
   * Tracing a `SourceMapSegment` ends when we get to an `OriginalSource`,
   * meaning this line/column location originated from this source file.
   */
  originalPositionFor(line: number, column: number, name: string): SourceMapSegmentObject {
    return { column, line, name, source: this.source, content: this.content };
  }
}
