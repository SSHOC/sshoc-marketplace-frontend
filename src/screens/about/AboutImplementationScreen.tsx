import type { PageProps } from '@/pages/about/index'
import AboutLayout from '@/screens/about/AboutLayout'
import Content, { metadata } from '@@/content/pages/implementation.mdx'

type ContentMetadata = {
  title: string
}

const meta = metadata as ContentMetadata

/**
 * About service screen.
 */
export default function AboutImplementationScreen({
  lastUpdatedAt,
}: PageProps): JSX.Element {
  return (
    <AboutLayout
      breadcrumb={{ pathname: '/about/implementation', label: 'About' }}
      title={meta.title}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Content />
    </AboutLayout>
  )
}
