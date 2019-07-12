describe('SourceMapTree', () => {
  describe('traceMappings()', () => {
    test.todo('traces each line');
    test.todo('skips segment if segment is 1-length');
    test.todo('skips segment if trace returns null');
    test.todo('traces name if segment is 5-length');
    test.todo('maps into traced segment');
    test.todo('maps into traced segment with name');

    test.todo('defaults decoded return map with original data');
  });

  describe('traceSegment()', () => {
    test.todo('traces LineSegments to the segment with matching generated column');
    test.todo('throws an error if line is not present');
    test.todo('returns null if no matching segment');
    test.todo('returns null if segment is 1-length');
    test.todo('passes in outer name to trace');
    test.todo('overrides name if segment is 5-length');
  });
});
