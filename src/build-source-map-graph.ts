import decodeSourceMap from './decode-source-map';
import GraphNode from './graph-node';
import OriginalSource from './original-source';
import { DecodedSourceMap, SourceMapInput, SourceMapLoader } from './types';

function buildNode(map: DecodedSourceMap, loader: SourceMapLoader): GraphNode {
  const { sourcesContent } = map;
  const sources = map.sources.map((sourceFile, i) => {
    const sourceMap = loader(sourceFile);
    const sourceContent = sourcesContent ? sourcesContent[i] : null;

    if (!sourceMap) {
      return new OriginalSource(sourceFile, sourceContent);
    }

    return buildNode(decodeSourceMap(sourceMap), loader);
  });

  return new GraphNode(map, sources);
}

export default function buildSourceMapGraph(
  map: SourceMapInput,
  loader: SourceMapLoader
): GraphNode {
  return buildNode(decodeSourceMap(map), loader);
}
