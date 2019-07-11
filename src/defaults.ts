export default function defaults<T, U>(target: T, source: U): T & U {
  return Object.assign(Object.create(null), source, target);
}
