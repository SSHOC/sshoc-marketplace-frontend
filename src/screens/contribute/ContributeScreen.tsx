import type { Toc } from '@stefanprobst/remark-extract-toc'
import type { PropsWithChildren } from 'react'

import type { ContributePage } from '@/pages/contribute/[id].page.template'
import ContributeLayout from '@/screens/contribute/ContributeLayout'

export type ContributeScreenProps = ContributePage.TemplateProps

/**
 * Contribute screen.
 */
export default function ContributeScreen({
  lastUpdatedTimestamp,
  metadata,
  params,
  children,
  tableOfContents,
}: ContributeScreenProps): JSX.Element {
  return (
    <ContributeLayout
      breadcrumb={{ pathname: `/contribute/${params.id}`, label: metadata.title }}
      title={metadata.title}
      toc={tableOfContents}
      lastUpdatedTimestamp={lastUpdatedTimestamp}
    >
      <div className="prose max-w-none">{children}</div>
    </ContributeLayout>
  )
}
