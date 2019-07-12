interface SourceMapV3 {
  file?: string;
  names: string[];
  sourceRoot?: string;
  sources: string[];
  sourcesContent?: (string | null)[];
  version: 3;
}

export type SourceMapSegment =
  | [number]
  | [number, number, number, number]
  | [number, number, number, number, number];

export interface RawSourceMap extends SourceMapV3 {
  mappings: string;
}

export interface DecodedSourceMap extends SourceMapV3 {
  mappings: SourceMapSegment[][];
}

export interface SourceMapSegmentObject {
  column: number;
  line: number;
  name: string;
  source: {
    content: string | null;
    filename: string;
  };
}

export type SourceMapInput = string | RawSourceMap | DecodedSourceMap;

export type SourceMapLoader = (file: string) => SourceMapInput | null | undefined;
