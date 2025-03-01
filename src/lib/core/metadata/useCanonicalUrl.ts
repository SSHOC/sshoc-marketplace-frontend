import type { UrlSearchParamsInit } from '@stefanprobst/request'
import { useMemo } from 'react'

import { usePathname } from '@/lib/core/navigation/usePathname'
import { createSiteUrl } from '@/lib/utils'

export type UseCanonicalUrlResult = string

export function useCanonicalUrl(searchParams?: UrlSearchParamsInit): UseCanonicalUrlResult {
  const pathname = usePathname()

  const canonicalUrl = useMemo(() => {
    const url = createSiteUrl({
      pathname,
      searchParams,
      hash: undefined,
    })

    return String(url)
  }, [pathname, searchParams])

  return canonicalUrl
}
