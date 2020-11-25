export function ensureArray<T extends string>(value: T | Array<T>): Array<T> {
  return Array.isArray(value) ? value : [value]
}
