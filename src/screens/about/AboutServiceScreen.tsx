import type { PageProps } from '@/pages/about/index'
import AboutLayout from '@/screens/about/AboutLayout'
import Content, { metadata } from '@@/content/pages/service.mdx'

type ContentMetadata = {
  title: string
}

const meta = metadata as ContentMetadata

/**
 * About service screen.
 */
export default function AboutServiceScreen({
  lastUpdatedAt,
}: PageProps): JSX.Element {
  return (
    <AboutLayout
      breadcrumb={{ pathname: '/about/service', label: 'About' }}
      title={meta.title}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Content />
    </AboutLayout>
  )
}
