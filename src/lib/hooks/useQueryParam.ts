import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { getQueryParam } from '@/lib/hooks/getQueryParam'

export function useQueryParam(name: string, multiple: false): string | undefined
export function useQueryParam(name: string, multiple: true): Array<string> | undefined
export function useQueryParam<T>(
  name: string,
  multiple: false,
  transform: (value: string) => T,
): T | undefined
export function useQueryParam<T>(
  name: string,
  multiple: true,
  transform: (value: string) => T,
): Array<T> | undefined

/**
 * Returns query param as single value or array of values. Empty strings and empty arrays return `undefined`.
 *
 * @param param Name of query parameter.
 * @param multiple Whether query param holds single value or array of values.
 * @param transform Optional function to transform string values, e.g. into numbers.
 */
export function useQueryParam<T>(
  name: string,
  multiple: boolean,
  transform?: (value: string) => T,
): Array<string> | Array<T> | T | string | undefined {
  const router = useRouter()

  const value = useMemo(() => {
    if (!router.isReady) return undefined
    const param = router.query[name]
    return getQueryParam(param, multiple, transform)
  }, [router, name, multiple, transform])

  return value
}
