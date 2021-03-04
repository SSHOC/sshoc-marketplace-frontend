/**
 * Ensures provided value is an array.
 */
export function ensureArray<T>(value: T | Array<T>): Array<T> {
  return Array.isArray(value) ? value : [value]
}
