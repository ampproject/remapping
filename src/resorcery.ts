import buildSourceMapGraph from './build-source-map-graph';
import { SourceMapInput, SourceMapLoader } from './types';
export { SourceMapSegment, RawSourceMap, DecodedSourceMap, SourceMapLoader } from './types';
import SourceMap from './source-map';

export default function resorcery(
  map: SourceMapInput,
  loader: SourceMapLoader,
  excludeContent?: boolean
): SourceMap {
  const graph = buildSourceMapGraph(map, loader);
  return new SourceMap(graph.traceMappings(), !!excludeContent);
}
