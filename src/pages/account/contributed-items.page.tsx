import type { StringParams } from '@stefanprobst/next-route-manifest'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { AccountScreenWithFiltersLayout } from '@/components/account/AccountScreenWithFiltersLayout'
import { BackgroundImage } from '@/components/account/BackgroundImage'
import { ContributedItemsBackgroundFetchIndicator } from '@/components/account/ContributedItemsBackgroundFetchIndicator'
import { ContributedItemSearchFilters } from '@/components/account/ContributedItemSearchFilters'
import { ContributedItemSearchResults } from '@/components/account/ContributedItemSearchResults'
import { ContributedItemSearchResultsFooter } from '@/components/account/ContributedItemSearchResultsFooter'
import { ContributedItemSearchResultsHeader } from '@/components/account/ContributedItemSearchResultsHeader'
import { ContributedItemsSearchResultsCount } from '@/components/account/ContributedItemsSearchResultsCount'
import type { SearchFilters } from '@/components/account/useContributedItemsSearchFilters'
import { FundingNotice } from '@/components/common/FundingNotice'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import { Breadcrumbs } from '@/lib/core/ui/Breadcrumbs/Breadcrumbs'
import { SpacedRow } from '@/lib/core/ui/SpacedRow/SpacedRow'

export namespace ContributedItemsPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = SearchFilters
  export type Props = WithDictionaries<'authenticated' | 'common'>
}

export async function getStaticProps(
  context: GetStaticPropsContext<ContributedItemsPage.PathParams>,
): Promise<GetStaticPropsResult<ContributedItemsPage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['authenticated', 'common'])

  return {
    props: {
      dictionaries,
    },
  }
}

export default function ContributedItemsPage(_props: ContributedItemsPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()

  const title = t(['authenticated', 'pages', 'contributed-items'])

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(['common', 'pages', 'home']) },
    {
      href: routes.AccountPage(),
      label: t(['authenticated', 'pages', 'account']),
    },
    {
      href: routes.ContributedItemsPage(),
      label: t(['authenticated', 'pages', 'contributed-items']),
    },
  ]

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} />
      <PageMainContent>
        <AccountScreenWithFiltersLayout>
          <BackgroundImage />
          <ScreenHeader>
            <Breadcrumbs links={breadcrumbs} />
            <SpacedRow>
              <ScreenTitle>
                {title}
                <ContributedItemsSearchResultsCount />
              </ScreenTitle>
              <ContributedItemsBackgroundFetchIndicator />
            </SpacedRow>
          </ScreenHeader>
          <ContributedItemSearchFilters />
          <ContributedItemSearchResultsHeader />
          <ContributedItemSearchResults />
          <ContributedItemSearchResultsFooter />
          <FundingNotice />
        </AccountScreenWithFiltersLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<ContributedItemsPage.Props> = ContributedItemsPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
