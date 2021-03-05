// import type { GetStaticPropsResult } from 'next'
// import { getLastUpdatedTimestamp } from '@/api/git'
import ContactScreen from '@/screens/contact/ContactScreen'

// export type PageProps = {
//   lastUpdatedAt: string
// }

/**
 * Contact page.
 */
export default function ContactPage(): JSX.Element {
  return <ContactScreen />
}

// export async function getStaticProps(): Promise<
//   GetStaticPropsResult<PageProps>
// > {
//   const pageId = 'contact'
//   const lastUpdatedAt = (await getLastUpdatedTimestamp(pageId)).toISOString()
//   return { props: { lastUpdatedAt } }
// }
