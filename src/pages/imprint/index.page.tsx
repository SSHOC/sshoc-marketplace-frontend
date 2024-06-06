import type { StringParams } from '@stefanprobst/next-route-manifest'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import * as path from 'path'
import { Fragment } from 'react'
import { fileURLToPath } from 'url'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ItemSearchBar } from '@/components/common/ItemSearchBar'
import { LastUpdatedTimestamp } from '@/components/common/LastUpdatedTimestamp'
import { Prose } from '@/components/common/Prose'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/imprint/BackgroundImage'
import { Content } from '@/components/imprint/Content'
import { ImprintScreenLayout } from '@/components/imprint/ImprintScreenLayout'
import { getLastUpdatedTimestamp } from '@/data/git/get-last-updated-timestamp'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import type { IsoDateString } from '@/lib/core/types'
import { Breadcrumbs } from '@/lib/core/ui/Breadcrumbs/Breadcrumbs'

export namespace ImprintPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'common'> {
    lastUpdatedTimestamp: IsoDateString
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext<ImprintPage.PathParams>,
): Promise<GetStaticPropsResult<ImprintPage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['common'])

  const filePath = path.relative(process.cwd(), fileURLToPath(import.meta.url))
  const lastUpdatedTimestamp = (await getLastUpdatedTimestamp(filePath)).toISOString()

  const url = new URL('https://imprint.acdh.oeaw.ac.at')
  // redmine id for production deployment
  url.pathname = String('17467')
  const imprint = await (await fetch(url)).text()

  return {
    props: {
      dictionaries,
      lastUpdatedTimestamp,
      imprint,
    },
  }
}

export default function ImprintPage(props: ImprintPage.Props): JSX.Element {
  const { t } = useI18n<'common'>()

  const title = t(['common', 'pages', 'imprint'])

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(['common', 'pages', 'home']) },
    { href: routes.ImprintPage(), label: t(['common', 'pages', 'imprint']) },
  ]

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <ImprintScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ScreenTitle>{t(['common', 'pages', 'imprint'])}</ScreenTitle>
          </ScreenHeader>
          <Content>
            <Prose html={props.imprint} />
            <LastUpdatedTimestamp dateTime={props.lastUpdatedTimestamp} />
          </Content>
          <FundingNotice />
        </ImprintScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<ImprintPage.Props> = ImprintPage

Page.getLayout = undefined
