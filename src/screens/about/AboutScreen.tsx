import type { PageProps } from '@/pages/about/[id]'
import AboutLayout from '@/screens/about/AboutLayout'

/**
 * About screen.
 */
export default function AboutScreen({
  lastUpdatedAt,
  metadata,
  html,
  id,
  pages,
}: PageProps): JSX.Element {
  return (
    <AboutLayout
      breadcrumb={{ pathname: `/about/${id}`, label: metadata.title }}
      title={metadata.title}
      lastUpdatedAt={lastUpdatedAt}
      links={pages}
      toc={metadata.toc}
    >
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </AboutLayout>
  )
}
