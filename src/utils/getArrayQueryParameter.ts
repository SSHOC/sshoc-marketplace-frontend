import type { ParsedUrlQuery } from 'querystring'

import { ensureArray } from '@/utils/ensureArray'

export function getArrayQueryParameter(param: ParsedUrlQuery[string]): Array<string> | undefined {
  if (param === undefined) return undefined
  const array = ensureArray(param)
  if (array.length === 0) return undefined
  return array
}
