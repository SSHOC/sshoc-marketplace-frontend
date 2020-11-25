import type { GetStaticPropsResult } from 'next'
import { getLastUpdatedTimestamp } from '@/api/git'
import AboutTeamScreen from '@/screens/about/AboutTeamScreen'

export type PageProps = {
  lastUpdatedAt: string
}

/**
 * About team page.
 */
export default function AboutPage(props: PageProps): JSX.Element {
  return <AboutTeamScreen {...props} />
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  const pageId = 'team'
  const lastUpdatedAt = (await getLastUpdatedTimestamp(pageId)).toISOString()
  return { props: { lastUpdatedAt } }
}
