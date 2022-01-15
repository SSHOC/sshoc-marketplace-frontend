import type { PageMetadataProps } from '@stefanprobst/next-page-metadata'
import Meta from '@stefanprobst/next-page-metadata'

import { useCanonicalUrl } from '@/modules/metadata/useCanonicalUrl'
import {
  description as siteDescription,
  openGraph,
  title as siteTitle,
  twitter,
  url as siteUrl,
} from '@@/config/metadata.json'

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
