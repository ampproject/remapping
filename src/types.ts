interface SourceMapV3 {
  file?: string | null;
  names: string[];
  sourceRoot?: string;
  sources: (string | null)[];
  sourcesContent?: (string | null)[];
  version: 3;
}

type Column = number;
type SourcesIndex = number;
type SourceLine = number;
type SourceColumn = number;
type NamesIndex = number;

export type SourceMapSegment =
  | [Column]
  | [Column, SourcesIndex, SourceLine, SourceColumn]
  | [Column, SourcesIndex, SourceLine, SourceColumn, NamesIndex];

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

export type Options = {
  excludeContent?: boolean;
  decodedMappings?: boolean;
};
