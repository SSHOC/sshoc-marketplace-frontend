import type { SiteMetadata } from '~/config/metadata.config'
import { siteMetadata } from '~/config/metadata.config'

export function useSiteMetadata(): SiteMetadata {
  return siteMetadata
}
