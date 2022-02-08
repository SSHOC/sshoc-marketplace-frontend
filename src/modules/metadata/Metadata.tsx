import type { PageMetadataProps } from '@stefanprobst/next-page-metadata'
import Meta from '@stefanprobst/next-page-metadata'

import { useCanonicalUrl } from '@/modules/metadata/useCanonicalUrl'
import { siteMetadata } from '~/config/metadata.config'

const { description: siteDescription, title: siteTitle, twitter, url: siteUrl } = siteMetadata

export type { PageMetadata } from '@stefanprobst/next-page-metadata'

/**
 * Page metadata.
 */
export default function Metadata(props: PageMetadataProps): JSX.Element {
  const canonicalUrl = useCanonicalUrl(siteUrl)
  return (
    <Meta
      description={siteDescription}
      canonicalUrl={canonicalUrl}
      titleTemplate={titleTemplate}
      twitter={twitter}
      {...props}
    />
  )
}

/**
 * Joins site title and page title.
 */
function titleTemplate(title?: string) {
  return [title, siteTitle].filter(Boolean).join(' | ')
}
