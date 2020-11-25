import type { PageProps } from '@/pages/about/index'
import AboutLayout from '@/screens/about/AboutLayout'
import Content, { metadata } from '@@/content/pages/website.mdx'

type ContentMetadata = {
  title: string
}

const meta = metadata as ContentMetadata

/**
 * About website screen.
 */
export default function AboutWebsiteScreen({
  lastUpdatedAt,
}: PageProps): JSX.Element {
  return (
    <AboutLayout
      breadcrumb={{ pathname: '/about/website', label: 'About' }}
      title={meta.title}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Content />
    </AboutLayout>
  )
}
