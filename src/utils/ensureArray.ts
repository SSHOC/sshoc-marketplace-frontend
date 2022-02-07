export function ensureArray<T extends string>(value: Array<T> | T): Array<T> {
  return Array.isArray(value) ? value : [value]
}
