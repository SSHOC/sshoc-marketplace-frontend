import type { GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { AccountScreenWithFiltersLayout } from '@/components/account/AccountScreenWithFiltersLayout'
import { BackgroundImage } from '@/components/account/BackgroundImage'
import { ModerateItemsBackgroundFetchIndicator } from '@/components/account/ModerateItemsBackgroundFetchIndicator'
import { ModerateItemSearchFilters } from '@/components/account/ModerateItemSearchFilters'
import { ModerateItemSearchResults } from '@/components/account/ModerateItemSearchResults'
import { ModerateItemSearchResultsFooter } from '@/components/account/ModerateItemSearchResultsFooter'
import { ModerateItemSearchResultsHeader } from '@/components/account/ModerateItemSearchResultsHeader'
import { ModerateItemsSearchResultsCount } from '@/components/account/ModerateItemsSearchResultsCount'
import type { SearchFilters } from '@/components/account/useModerateItemsSearchFilters'
import { FundingNotice } from '@/components/common/FundingNotice'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import { Breadcrumbs } from '@/lib/core/ui/Breadcrumbs/Breadcrumbs'
import { SpacedRow } from '@/lib/core/ui/SpacedRow/SpacedRow'

export namespace ModerateItemsPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = SearchFilters
  export type Props = WithDictionaries<'authenticated' | 'common'>
}

export async function getStaticProps(): Promise<GetStaticPropsResult<ModerateItemsPage.Props>> {
  const locale = getLocale()
  const messages = await load(locale, ['authenticated', 'common'])

  return {
    props: {
      messages,
    },
  }
}

export default function ModerateItemsPage(_props: ModerateItemsPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()

  const title = t(['authenticated', 'pages', 'moderate-items'])

  const breadcrumbs = [
    { href: '/', label: t(['common', 'pages', 'home']) },
    {
      href: `/account`,
      label: t(['authenticated', 'pages', 'account']),
    },
    {
      href: `/account/moderate-items`,
      label: t(['authenticated', 'pages', 'moderate-items']),
    },
  ]

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <AccountScreenWithFiltersLayout>
          <BackgroundImage />
          <ScreenHeader>
            <Breadcrumbs links={breadcrumbs} />
            <SpacedRow>
              <ScreenTitle>
                {title}
                <ModerateItemsSearchResultsCount />
              </ScreenTitle>
              <ModerateItemsBackgroundFetchIndicator />
            </SpacedRow>
          </ScreenHeader>
          <ModerateItemSearchFilters />
          <ModerateItemSearchResultsHeader />
          <ModerateItemSearchResults />
          <ModerateItemSearchResultsFooter />
          <FundingNotice />
        </AccountScreenWithFiltersLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<ModerateItemsPage.Props> = ModerateItemsPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator'].includes(user.role)
}
