import type { GetStaticPropsResult } from 'next'

import { getLastUpdatedTimestamp } from '@/api/git'
import AboutImplementationScreen from '@/screens/about/AboutImplementationScreen'

export type PageProps = {
  lastUpdatedAt: string
}

/**
 * About implementation page.
 */
export default function AboutImplementationPage(props: PageProps): JSX.Element {
  return <AboutImplementationScreen {...props} />
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  const pageId = 'implementation'
  const lastUpdatedAt = (await getLastUpdatedTimestamp(pageId)).toISOString()
  return { props: { lastUpdatedAt } }
}
