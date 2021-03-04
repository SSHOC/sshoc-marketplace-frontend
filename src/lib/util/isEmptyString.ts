/**
 * Type guard for empty string.
 */
export function isEmptyString(value: unknown): value is '' {
  return value === ''
}
