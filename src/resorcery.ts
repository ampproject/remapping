import buildSourceMapTree from './build-source-map-tree';
import SourceMap from './source-map';
import { SourceMapInput, SourceMapLoader } from './types';

/**
 * Traces through all the mappings in the root sourcemap, through the sources
 * (and their sourcemaps), all the way back to the original source location.
 *
 * `loader` will be called every time we encounter a source file. If it returns
 * a sourcemap, we will recurse into that sourcemap to continue the trace. If
 * it returns a falsey value, that source file is treated as an original,
 * unmodified soruce file.
 *
 * Pass `excludeContent` content to exclude any self-containing source file
 * content from the output sourcemap.
 */
export default function resorcery(
  map: SourceMapInput,
  loader: SourceMapLoader,
  excludeContent?: boolean
): SourceMap {
  const graph = buildSourceMapTree(map, loader);
  return new SourceMap(graph.traceMappings(), !!excludeContent);
}
