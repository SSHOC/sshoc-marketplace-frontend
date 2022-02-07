export function ensureScalar<T extends string>(value: Array<T> | T): T {
  return Array.isArray(value) ? value[0] : value
}
