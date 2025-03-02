import type { GetStaticPropsResult } from 'next'
import { useTranslations } from 'next-intl'
import * as path from 'path'
import { Fragment } from 'react'
import { fileURLToPath } from 'url'

import { FundingNotice } from '@/components/common/FundingNotice'
import { Image } from '@/components/common/Image'
import { ItemSearchBar } from '@/components/common/ItemSearchBar'
import { LastUpdatedTimestamp } from '@/components/common/LastUpdatedTimestamp'
import { Link } from '@/components/common/Link'
import { Prose } from '@/components/common/Prose'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/terms-of-use/BackgroundImage'
import { Content } from '@/components/terms-of-use/Content'
import TermsOfUse, { metadata } from '@/components/terms-of-use/TermsOfUse.mdx'
import { TermsOfUseScreenLayout } from '@/components/terms-of-use/TermsOfUseScreenLayout'
import { getLastUpdatedTimestamp } from '@/data/git/get-last-updated-timestamp'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import type { IsoDateString } from '@/lib/core/types'
import { Breadcrumbs } from '@/lib/core/ui/Breadcrumbs/Breadcrumbs'

export namespace TermsOfUsePage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'common'> {
    lastUpdatedTimestamp: IsoDateString
  }
}

export async function getStaticProps(): Promise<GetStaticPropsResult<TermsOfUsePage.Props>> {
  const locale = getLocale()
  const messages = await load(locale, ['common'])

  const filePath = path.relative(process.cwd(), fileURLToPath(import.meta.url))
  const lastUpdatedTimestamp = (await getLastUpdatedTimestamp(filePath)).toISOString()

  return {
    props: {
      messages,
      lastUpdatedTimestamp,
    },
  }
}

export default function TermsOfUsePage(props: TermsOfUsePage.Props): JSX.Element {
  const t = useTranslations('common')

  const title = t('pages.terms-of-use')

  const breadcrumbs = [
    { href: '/', label: t('pages.home') },
    { href: `/terms-of-use`, label: t('pages.terms-of-use') },
  ]

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <TermsOfUseScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ScreenTitle>{metadata.title}</ScreenTitle>
          </ScreenHeader>
          <Content>
            <Prose>
              <TermsOfUse components={{ Image, Link }} />
            </Prose>
            <LastUpdatedTimestamp dateTime={props.lastUpdatedTimestamp} />
          </Content>
          <FundingNotice />
        </TermsOfUseScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<TermsOfUsePage.Props> = TermsOfUsePage

Page.getLayout = undefined
