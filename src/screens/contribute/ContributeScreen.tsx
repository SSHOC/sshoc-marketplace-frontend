import type { PageProps } from '@/pages/contribute/[id]'
import ContributeLayout from '@/screens/contribute/ContributeLayout'

/**
 * Contribute screen.
 */
export default function ContributeScreen({
  lastUpdatedAt,
  metadata,
  html,
  id,
  pages,
}: PageProps): JSX.Element {
  return (
    <ContributeLayout
      breadcrumb={{ pathname: `/contribute/${id}`, label: metadata.title }}
      title={metadata.title}
      lastUpdatedAt={lastUpdatedAt}
      links={pages}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </ContributeLayout>
  )
}