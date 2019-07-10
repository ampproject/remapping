type Dictionary<T> = { [key: string]: T };

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

export interface SourceMapSegmentObject<T> {
  column: number;
  line: number;
  name: string;
  source: T;
}

export type SourceMapInput = string | RawSourceMap | DecodedSourceMap;

export type SourceMapInputMap = Dictionary<SourceMapInput>;

export type DecodedSourceMapMap = Dictionary<DecodedSourceMap>;
