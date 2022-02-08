import type { Toc } from '@stefanprobst/remark-extract-toc'
import type { PropsWithChildren } from 'react'

import type { AboutPage } from '@/pages/about/[id].page.template'
import AboutLayout from '@/screens/about/AboutLayout'

export type AboutScreenProps = AboutPage.TemplateProps

/**
 * About screen.
 */
export default function AboutScreen({
  lastUpdatedTimestamp,
  metadata,
  params,
  children,
  tableOfContents,
}: AboutScreenProps): JSX.Element {
  return (
    <AboutLayout
      breadcrumb={{ pathname: `/about/${params.id}`, label: metadata.title }}
      title={metadata.title}
      toc={tableOfContents}
      lastUpdatedTimestamp={lastUpdatedTimestamp}
    >
      <div className="prose max-w-none">{children}</div>
    </AboutLayout>
  )
}
