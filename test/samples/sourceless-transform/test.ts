import remapping from '../../../src/remapping';

describe('source-less transform', () => {
  const original: any = {
    version: '3',
    sources: ['source.ts'],
    names: [],
    mappings: 'AAAA',
    sourcesContent: ['// hello'],
  };
  const minified: any = {
    version: '3',
    sources: [],
    names: [],
    mappings: '',
  };

  test('remapping with loader generates empty sourcemap', () => {
    const loader = jest.fn(() => null);
    loader.mockReturnValueOnce(original);
    const remapped = remapping(minified, loader);

    expect(loader).not.toHaveBeenCalled();
    expect(remapped.sources).toHaveLength(0);
    expect(remapped.mappings).toBe('');
  });

  test('remapping with array shorthand generates empty sourcemap', () => {
    const loader = jest.fn(() => null);
    const remapped = remapping([minified, original], loader);

    expect(loader).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenCalledWith('source.ts', expect.anything());
    expect(remapped.sources).toHaveLength(0);
    expect(remapped.mappings).toBe('');
  });
});
