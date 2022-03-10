import type { UrlSearchParamsInit } from '@stefanprobst/request'
import { useMemo } from 'react'

import { useLocale } from '@/lib/core/i18n/useLocale'
import { usePathname } from '@/lib/core/navigation/usePathname'
import { createSiteUrl } from '@/lib/utils'
import type { Locale } from '~/config/i18n.config.mjs'

export type UseAlternateLocaleUrlsResult = Array<{ hrefLang: Locale; href: string }>

export function useAlternateLocaleUrls(
  searchParams?: UrlSearchParamsInit,
): UseAlternateLocaleUrlsResult {
  const pathname = usePathname()
  const { locales } = useLocale()

  const urls = useMemo(() => {
    return locales.map((locale) => {
      const url = createSiteUrl({
        locale,
        pathname,
        searchParams,
        hash: undefined,
      })

      return { hrefLang: locale, href: String(url) }
    })
  }, [pathname, locales, searchParams])

  return urls
}
