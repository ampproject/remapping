import buildSourceMapGraph from './build-source-map-graph';
import { SourceMapInput, SourceMapInputMap, DecodedSourceMap } from './types';
export { SourceMapSegment, RawSourceMap, DecodedSourceMap, SourceMapInputMap } from './types';

export default function resorcery(
  map: SourceMapInput,
  modules: SourceMapInputMap,
  excludeContent: boolean
): DecodedSourceMap {

  const graph = buildSourceMapGraph(map, modules);

  const { sources, sourcesContent, names, mappings } = graph.traceMappings();

  return { version: 3, sources, sourcesContent, names, mappings };
}
