import type { GetStaticPropsResult } from 'next'
import { getLastUpdatedTimestamp } from '@/api/git'
import AboutScreen from '@/screens/about/AboutScreen'

export type PageProps = {
  lastUpdatedAt: string
}

/**
 * About page.
 */
export default function AboutPage(props: PageProps): JSX.Element {
  return <AboutScreen {...props} />
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  const pageId = 'about'
  const lastUpdatedAt = (await getLastUpdatedTimestamp(pageId)).toISOString()
  return { props: { lastUpdatedAt } }
}
