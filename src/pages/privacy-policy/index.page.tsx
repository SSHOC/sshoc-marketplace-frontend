import type { GetStaticPropsResult } from 'next'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { getLastUpdatedTimestamp } from '@/api/git'
import type { IsoDateString } from '@/lib/core/types'
import PrivacyPolicyScreen from '@/screens/privacy-policy/PrivacyPolicyScreen'

export namespace PrivacyPolicyPage {
  export type Props = {
    lastUpdatedTimestamp: IsoDateString
  }
}

export async function getStaticProps(): Promise<GetStaticPropsResult<PrivacyPolicyPage.Props>> {
  const filePath = path.relative(process.cwd(), fileURLToPath(import.meta.url))
  const lastUpdatedTimestamp = (await getLastUpdatedTimestamp(filePath)).toISOString()

  return {
    props: {
      lastUpdatedTimestamp,
    },
  }
}

/**
 * Privacy policy page.
 */
export default function PrivacyPolicyPage(props: PrivacyPolicyPage.Props): JSX.Element {
  return <PrivacyPolicyScreen lastUpdatedTimestamp={props.lastUpdatedTimestamp} />
}
