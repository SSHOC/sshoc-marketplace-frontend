import type { PageMetadataProps } from '@stefanprobst/next-page-metadata'
import Meta from '@stefanprobst/next-page-metadata'

import { useCanonicalUrl } from '@/modules/metadata/useCanonicalUrl'
import metadata from '@@/config/metadata.json'

const {
  description: siteDescription,
  openGraph,
  title: siteTitle,
  twitter,
  url: siteUrl,
} = metadata

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
      openGraph={openGraph}
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
