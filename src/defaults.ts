/**
 * Creates a brand new (prototype-less) object with the enumerable-own
 * properties of `target`. Any enumerable-own properties from `source` which
 * are not present on `target` will be copied as well.
 */
export default function defaults<T, U>(target: T, source: U): T & U {
  return Object.assign(Object.create(null), source, target) as T & U;
}
