import type { GetStaticPropsResult } from 'next'
import { getLastUpdatedTimestamp } from '@/api/git'
import AboutWebsiteScreen from '@/screens/about/AboutWebsiteScreen'

export type PageProps = {
  lastUpdatedAt: string
}

/**
 * About website page.
 */
export default function AboutPage(props: PageProps): JSX.Element {
  return <AboutWebsiteScreen {...props} />
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  const pageId = 'website'
  const lastUpdatedAt = (await getLastUpdatedTimestamp(pageId)).toISOString()
  return { props: { lastUpdatedAt } }
}
