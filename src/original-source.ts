import { SourceMapSegmentObject } from './types';

export default class OriginalSource {
  content: string | null;
  filename: string;

  constructor(filename: string, content: string | null) {
    this.filename = filename;
    this.content = content;
  }

  traceSegment(line: number, column: number, name: string): SourceMapSegmentObject<OriginalSource> {
    return { line, column, name, source: this };
  }
}
