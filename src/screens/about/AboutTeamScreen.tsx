import type { PageProps } from '@/pages/about/index'
import AboutLayout from '@/screens/about/AboutLayout'
import Content, { metadata } from '@@/content/pages/team.mdx'

type ContentMetadata = {
  title: string
}

const meta = metadata as ContentMetadata

/**
 * About team screen.
 */
export default function AboutTeamScreen({
  lastUpdatedAt,
}: PageProps): JSX.Element {
  return (
    <AboutLayout
      breadcrumb={{ pathname: '/about/team', label: 'About' }}
      title={meta.title}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Content />
    </AboutLayout>
  )
}
