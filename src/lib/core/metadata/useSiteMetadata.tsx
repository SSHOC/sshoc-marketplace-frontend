import { useLocale } from '@/lib/core/i18n/useLocale'
import type { SiteMetadata } from '~/config/metadata.config'
import { siteMetadata } from '~/config/metadata.config'

export function useSiteMetadata(): SiteMetadata {
  const { locale } = useLocale()

  return siteMetadata[locale]
}
