import decodeSourceMap from './decode-source-map';
import GraphNode from './graph-node';
import OriginalSource from './original-source';
import resolve from './resolve';
import { DecodedSourceMap, SourceMapInput, SourceMapLoader } from './types';

function buildNode(map: DecodedSourceMap, loader: SourceMapLoader): GraphNode {
  const { sourceRoot, sourcesContent } = map;
  const sources = map.sources.map((sourceFile: string, i: number) => {
    const sourceMap = loader(resolve(sourceFile, sourceRoot));
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
