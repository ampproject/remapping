import { decodeSourceMap, decodeSourceMapMap } from './decode-source-map';
import GraphNode from './graph-node';
import OriginalSource from './original-source';
import { DecodedSourceMap, DecodedSourceMapMap, SourceMapInput, SourceMapInputMap } from './types';

function buildNode(
  map: DecodedSourceMap,
  modules: DecodedSourceMapMap,
  sourceContent: string | null
): GraphNode {
  const { sourcesContent } = map;
  const sources = map.sources.map((sourceFile, i) => {
    const sourceMap = modules[sourceFile] as DecodedSourceMap | undefined;
    if (sourceMap === undefined) {
      return new OriginalSource(sourceFile, sourceContent);
    }

    const sc = sourcesContent ? sourcesContent[i] : null;
    return buildNode(sourceMap, modules, sc);
  });

  return new GraphNode(map, sources);
}

export default function buildSourceMapGraph(
  map: SourceMapInput,
  modules: SourceMapInputMap
): GraphNode {
  return buildNode(decodeSourceMap(map), decodeSourceMapMap(modules), null);
}
