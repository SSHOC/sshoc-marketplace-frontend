import { ensureArray } from '@/lib/util/ensureArray'
import { ensureScalar } from '@/lib/util/ensureScalar'
import { isEmptyString } from '@/lib/util/isEmptyString'
import { isUndefined } from '@/lib/util/isUndefined'

export function getQueryParam(
  param: string | Array<string> | undefined,
  multiple: false,
): string | undefined
export function getQueryParam(
  param: string | Array<string> | undefined,
  multiple: true,
): Array<string> | undefined
export function getQueryParam<T>(
  param: string | Array<string> | undefined,
  multiple: false,
  transform: (value: string) => T,
): T | undefined
export function getQueryParam<T>(
  param: string | Array<string> | undefined,
  multiple: true,
  transform: (value: string) => T,
): Array<T> | undefined
export function getQueryParam<T>(
  param: string | Array<string> | undefined,
  multiple: boolean,
  transform?: (value: string) => T,
): string | Array<string> | T | Array<T> | undefined

/**
 * Returns query param as single value or array of values. Empty strings and empty arrays return `undefined`.
 *
 * @param param Query parameter value.
 * @param multiple Whether query param holds single value or array of values.
 * @param transform Optional function to transform string values, e.g. into numbers.
 */
export function getQueryParam(
  param: string | Array<string> | undefined,
  multiple: boolean,
  transform?: (value: string) => unknown,
): unknown {
  if (param === undefined) return undefined
  if (Array.isArray(param) && param.length === 0) return undefined

  if (multiple === true) {
    const values = ensureArray(param).filter((value) => !isEmptyString(value))
    if (!transform) return values
    const transformed = values
      .map(transform)
      .filter((value) => !isUndefined(value))
    return transformed.length > 0 ? transformed : undefined
  } else {
    /** Will never return `undefined`, since we check for empty array above. */
    const value = ensureScalar(param) as string
    if (isEmptyString(value)) return undefined
    if (!transform) return value
    return transform(value)
  }
}
