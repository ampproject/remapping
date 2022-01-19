import OriginalSource from './original-source';
import resolve from './resolve';
import SourceMapTree from './source-map-tree';
import stripFilename from './strip-filename';

import type { RawSourceMap, DecodedSourceMap, SourceMapInput, SourceMapLoader } from './types';

function asArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) return value;
  return [value];
}

function parseMap(map: SourceMapInput): RawSourceMap | DecodedSourceMap {
  if (typeof map === 'string') return JSON.parse(map);
  return map;
}

/**
 * Recursively builds a tree structure out of sourcemap files, with each node
 * being either an `OriginalSource` "leaf" or a `SourceMapTree` composed of
 * `OriginalSource`s and `SourceMapTree`s.
 *
 * Every sourcemap is composed of a collection of source files and mappings
 * into locations of those source files. When we generate a `SourceMapTree` for
 * the sourcemap, we attempt to load each source file's own sourcemap. If it
 * does not have an associated sourcemap, it is considered an original,
 * unmodified source file.
 */
export default function buildSourceMapTree(
  input: SourceMapInput | SourceMapInput[],
  loader: SourceMapLoader
): SourceMapTree {
  const maps = asArray(input).map(parseMap);
  const map = maps.pop()!;

  for (let i = 0; i < maps.length; i++) {
    if (maps[i].sources.length > 1) {
      throw new Error(
        `Transformation map ${i} must have exactly one source file.\n` +
          'Did you specify these with the most recent transformation maps first?'
      );
    }
  }

  let tree = build(map, loader, undefined);
  for (let i = maps.length - 1; i >= 0; i--) {
    tree = new SourceMapTree(maps[i], [tree]);
  }
  return tree;
}

function build(
  map: RawSourceMap | DecodedSourceMap,
  loader: SourceMapLoader,
  relativeRoot?: string
): SourceMapTree {
  const { sourceRoot, sources, sourcesContent } = map;

  const children = sources.map(
    (sourceFile: string | null, i: number): SourceMapTree | OriginalSource => {
      // Each source file is loaded relative to the sourcemap's own sourceRoot,
      // which is itself relative to the sourcemap's parent.
      const uri = resolve(sourceFile || '', resolve(sourceRoot || '', stripFilename(relativeRoot)));

      // Use the provided loader callback to retrieve the file's sourcemap.
      // TODO: We should eventually support async loading of sourcemap files.
      const sourceMap = loader(uri);

      // If there is no sourcemap, then it is an unmodified source file.
      if (!sourceMap) {
        // The source file's actual contents must be included in the sourcemap
        // (done when generating the sourcemap) for it to be included as a
        // sourceContent in the output sourcemap.
        const sourceContent = sourcesContent ? sourcesContent[i] : null;
        return new OriginalSource(uri, sourceContent);
      }

      // Else, it's a real sourcemap, and we need to recurse into it to load its
      // source files.
      return build(parseMap(sourceMap), loader, uri);
    }
  );

  return new SourceMapTree(map, children);
}
