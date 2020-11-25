export function ensureScalar<T extends string>(value: T | Array<T>): T {
  return Array.isArray(value) ? value[0] : value
}
