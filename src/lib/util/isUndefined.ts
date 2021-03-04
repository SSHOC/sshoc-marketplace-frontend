/**
 * Type guard for `undefined`.
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}
