import type { GetStaticPropsResult } from 'next'
import { getLastUpdatedTimestamp } from '@/api/git'
import ContactScreen from '@/screens/contact/ContactScreen'

export type PageProps = {
  lastUpdatedAt: string
}

/**
 * Contact page.
 */
export default function ContactPage(props: PageProps): JSX.Element {
  return <ContactScreen {...props} />
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  const pageId = 'contact'
  const lastUpdatedAt = (await getLastUpdatedTimestamp(pageId)).toISOString()
  return { props: { lastUpdatedAt } }
}
