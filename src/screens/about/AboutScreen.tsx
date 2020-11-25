import type { PageProps } from '@/pages/about/index'
import AboutLayout from '@/screens/about/AboutLayout'
import Content, { metadata } from '@@/content/pages/about.mdx'

type ContentMetadata = {
  title: string
}

const meta = metadata as ContentMetadata

/**
 * About screen.
 */
export default function AboutScreen({ lastUpdatedAt }: PageProps): JSX.Element {
  return (
    <AboutLayout
      breadcrumb={{ pathname: '/about', label: 'About' }}
      title={meta.title}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Content />
    </AboutLayout>
  )
}
