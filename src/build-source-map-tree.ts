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

import decodeSourceMap from './decode-source-map';
import OriginalSource from './original-source';
import resolve from './resolve';
import SourceMapTree from './source-map-tree';
import stripFilename from './strip-filename';

import type { SourceMapInput, SourceMapLoader } from './types';

function asArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) return value;
  return [value];
}

function id(relativeRoot: string, index: number): string {
  return `${relativeRoot}.${index}`;
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
  loader: SourceMapLoader,
  isEdit: (map: SourceMapInput) => boolean,
  relativeRoot: string
): SourceMapTree {
  const maps = asArray(input).map((map: SourceMapInput) => {
    return { isEdit: isEdit(map), decoded: decodeSourceMap(map) };
  });
  const map = maps.pop()!;

  for (let i = 0; i < maps.length; i++) {
    if (maps[i].decoded.sources.length !== 1) {
      throw new Error(
        `Transformation map ${id(
          relativeRoot || 'input',
          i
        )} must have exactly one source file.\n` +
          'Did you specify these with the most recent transformation maps first?'
      );
    }
  }
  if (map.isEdit) {
    if (map.decoded.sources.length !== 1) {
      throw new Error(
        `Edit map ${id(relativeRoot || 'input', maps.length)} must have exactly one source file.`
      );
    }
  } else {
    if (map.decoded.sources.length === 0) {
      throw new Error(
        `Sourcemap ${id(relativeRoot || 'input', maps.length)} must have at least one source file.`
      );
    }
  }

  const { sourceRoot, sources, sourcesContent } = map.decoded;

  const children = sources.map((sourceFile: string | null, i: number):
    | SourceMapTree
    | OriginalSource => {
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
    return buildSourceMapTree(sourceMap, loader, isEdit, uri);
  });

  let tree = new SourceMapTree(map.decoded, map.isEdit, children);
  for (let i = maps.length - 1; i >= 0; i--) {
    const { decoded, isEdit } = maps[i];
    tree = new SourceMapTree(decoded, isEdit, [tree]);
  }
  return tree;
}
