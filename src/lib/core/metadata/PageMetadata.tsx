import type { PageMetadataProps as NextPageMetadataProps } from '@stefanprobst/next-page-metadata'
import { PageMetadata as NextPageMetadata } from '@stefanprobst/next-page-metadata'

import { usePageTitleTemplate } from '@/lib/core/metadata/usePageTitleTemplate'

export type PageMetadataProps = NextPageMetadataProps

export function PageMetadata(props: PageMetadataProps): JSX.Element {
  const titleTemplate = usePageTitleTemplate()

  return <NextPageMetadata titleTemplate={titleTemplate} {...props} />
}
