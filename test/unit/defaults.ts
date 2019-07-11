import defaults from '../../src/defaults';

describe('defaults', () => {
  const enumerableProto = 'enumberableProto';
  const nonenumerableProto = 'nonenumberableProto';
  const enumerableOwn = 'enumberableOwn';
  const nonenumerableOwn = 'nonenumberableOwn';

  function defineProperty(target: {}, prop: string, enumerable: boolean): void {
    Object.defineProperty(target, prop, { enumerable, value: {} });
  }

  test('creates a prototype-less object', () => {
    const res = defaults({}, {});

    expect(Object.getPrototypeOf(res)).toBe(null);
  });

  test('copies enumerable-own properties from source', () => {
    const proto = Object.create(null);
    const source = Object.create(proto);

    defineProperty(proto, enumerableProto, true);
    defineProperty(proto, nonenumerableProto, false);
    defineProperty(source, enumerableOwn, true);
    defineProperty(source, nonenumerableOwn, false);

    const res = defaults({}, source);

    expect(res).toHaveProperty(enumerableOwn, source[enumerableOwn]);

    expect(res).not.toHaveProperty(enumerableProto);
    expect(res).not.toHaveProperty(nonenumerableProto);
    expect(res).not.toHaveProperty(nonenumerableOwn);
  });

  test('copies enumerable-own properties from target', () => {
    const proto = Object.create(null);
    const target = Object.create(proto);

    defineProperty(proto, enumerableProto, true);
    defineProperty(proto, nonenumerableProto, false);
    defineProperty(target, enumerableOwn, true);
    defineProperty(target, nonenumerableOwn, false);

    const res = defaults(target, {});

    expect(res).toHaveProperty(enumerableOwn, target[enumerableOwn]);

    expect(res).not.toHaveProperty(enumerableProto);
    expect(res).not.toHaveProperty(nonenumerableProto);
    expect(res).not.toHaveProperty(nonenumerableOwn);
  });

  test('enumberable-own properties from target take precedence over source', () => {
    const proto = Object.create(null);
    const source = Object.create(proto);
    const target = Object.create(proto);

    defineProperty(proto, enumerableProto, true);
    defineProperty(proto, nonenumerableProto, false);
    defineProperty(target, enumerableOwn, true);
    defineProperty(target, nonenumerableOwn, false);
    defineProperty(source, enumerableOwn, true);
    // We're setting source[nonenumerableOwn] to be enumerable...
    defineProperty(source, nonenumerableOwn, true);

    const res = defaults(target, source);

    expect(res).toHaveProperty(enumerableOwn, target[enumerableOwn]);
    // Source[nonenumerableOwn] is enumerable...
    expect(res).toHaveProperty(nonenumerableOwn, source[nonenumerableOwn]);

    expect(res).not.toHaveProperty(enumerableProto);
    expect(res).not.toHaveProperty(nonenumerableProto);
  });
});
