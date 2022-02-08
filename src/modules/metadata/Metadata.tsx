import type { PageMetadataProps } from '@stefanprobst/next-page-metadata'
import { PageMetadata } from '@stefanprobst/next-page-metadata'

import { useCanonicalUrl } from '@/modules/metadata/useCanonicalUrl'
import { siteMetadata } from '~/config/metadata.config'

const { description: siteDescription, title: siteTitle, twitter, url: siteUrl } = siteMetadata

/**
 * Page metadata.
 */
export default function Metadata(props: PageMetadataProps): JSX.Element {
  const canonicalUrl = useCanonicalUrl(siteUrl)
  return (
    <PageMetadata
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
