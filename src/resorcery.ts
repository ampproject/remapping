import buildSourceMapGraph from './build-source-map-graph';
import { DecodedSourceMap, SourceMapInput, SourceMapInputMap } from './types';
export { SourceMapSegment, RawSourceMap, DecodedSourceMap, SourceMapInputMap } from './types';

export default function resorcery(
  map: SourceMapInput,
  modules: SourceMapInputMap,
  excludeContent: boolean
): DecodedSourceMap {
  const graph = buildSourceMapGraph(map, modules);

  const { mappings, names, sources, sourcesContent } = graph.traceMappings();

  return { mappings, names, sources, sourcesContent, version: 3 };
}
