import type { GetStaticPropsResult } from 'next'
import { getLastUpdatedTimestamp } from '@/api/git'
import AboutServiceScreen from '@/screens/about/AboutServiceScreen'

export type PageProps = {
  lastUpdatedAt: string
}

/**
 * About service page.
 */
export default function AboutServicePage(props: PageProps): JSX.Element {
  return <AboutServiceScreen {...props} />
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  const pageId = 'service'
  const lastUpdatedAt = (await getLastUpdatedTimestamp(pageId)).toISOString()
  return { props: { lastUpdatedAt } }
}
