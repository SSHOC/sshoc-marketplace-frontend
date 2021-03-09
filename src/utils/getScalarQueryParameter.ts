import type { ParsedUrlQuery } from 'querystring'

import { ensureScalar } from '@/utils/ensureScalar'

export function getScalarQueryParameter(
  param: ParsedUrlQuery[string],
): string | undefined {
  if (param === undefined) return undefined
  const scalar = ensureScalar(param)
  if (scalar.length === 0) return undefined
  return scalar
}
