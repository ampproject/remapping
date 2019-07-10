import buildSourceMapGraph from './build-source-map-graph';
import { SourceMapInput, SourceMapInputMap } from './types';
export { SourceMapSegment, RawSourceMap, DecodedSourceMap, SourceMapInputMap } from './types';
import SourceMap from './source-map';

export default function resorcery(
  map: SourceMapInput,
  modules: SourceMapInputMap,
  excludeContent?: boolean
): SourceMap {
  const graph = buildSourceMapGraph(map, modules);
  return new SourceMap(graph.traceMappings(), !!excludeContent);
}
