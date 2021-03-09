import type { GetStaticPropsResult } from 'next'

import { getLastUpdatedTimestamp } from '@/api/git'
import PrivacyPolicyScreen from '@/screens/privacy-policy/PrivacyPolicyScreen'

export type PageProps = {
  lastUpdatedAt: string
}

/**
 * Privacy policy page.
 */
export default function PrivacyPolicyPage(props: PageProps): JSX.Element {
  return <PrivacyPolicyScreen {...props} />
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  const pageId = 'privacy-policy'
  const lastUpdatedAt = (await getLastUpdatedTimestamp(pageId)).toISOString()
  return { props: { lastUpdatedAt } }
}
