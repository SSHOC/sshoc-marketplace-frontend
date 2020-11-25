/**
 * Assert exhaustive switch statement.
 *
 * @example
 * const value = 'apple' as 'apple' | 'orange'
 * switch (value) {
 *   case 'apple':
 *     return value
 *   default:
 *     throw new UnreachableError(value)
 * }
 */
export default class UnreachableError extends Error {
  constructor(value: never) {
    super(`Unreachable: ${value}.`)
  }
}
