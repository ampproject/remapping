import type { SourceMapInput } from '@jridgewell/trace-mapping';

export type {
  SourceMapSegment,
  DecodedSourceMap,
  EncodedSourceMap,
} from '@jridgewell/trace-mapping';

export type { SourceMapInput };

export interface SourceMapSegmentObject {
  column: number;
  line: number;
  name: string;
  source: string;
  content: string | null;
}

export type LoaderContext = {
  readonly importer: string;
  readonly depth: number;
  source: string;
  content: string | null | undefined;
};

export type SourceMapLoader = (
  file: string,
  ctx: LoaderContext
) => SourceMapInput | null | undefined | void;

export type Options = {
  excludeContent?: boolean;
  decodedMappings?: boolean;
};
