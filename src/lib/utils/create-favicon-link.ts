import { createSiteUrl } from '@/lib/utils'
import type { Locale } from '~/config/i18n.config'
import { defaultLocale } from '~/config/i18n.config'

export function createFaviconLink(locale: Locale, fileName: string): URL {
  return createSiteUrl({
    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
    locale: locale === defaultLocale ? undefined : locale,
    pathname: fileName,
  })
}
