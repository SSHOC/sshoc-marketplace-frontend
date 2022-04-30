import type { StringParams } from '@stefanprobst/next-route-manifest'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ItemSearchBar } from '@/components/common/ItemSearchBar'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundFetchIndicator } from '@/components/search/BackgroundFetchIndicator'
import { BackgroundImage } from '@/components/search/BackgroundImage'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SearchResults } from '@/components/search/SearchResults'
import { SearchResultsCount } from '@/components/search/SearchResultsCount'
import { SearchResultsFooter } from '@/components/search/SearchResultsFooter'
import { SearchResultsHeader } from '@/components/search/SearchResultsHeader'
import { SearchScreenLayout } from '@/components/search/SearchScreenLayout'
import type { SearchFilters as ItemSearchFilters } from '@/components/search/useSearchFilters'
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

export namespace SearchPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = ItemSearchFilters
  export type Props = WithDictionaries<'common'>
}

export async function getStaticProps(
  context: GetStaticPropsContext<SearchPage.PathParams>,
): Promise<GetStaticPropsResult<SearchPage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['common'])

  return {
    props: {
      dictionaries,
    },
  }
}

export default function SearchPage(_props: SearchPage.Props): JSX.Element {
  const { t } = useI18n<'common'>()

  const title = t(['common', 'pages', 'search'])

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(['common', 'pages', 'home']) },
    { href: routes.SearchPage(), label: t(['common', 'pages', 'search']) },
  ]

  return (
    <Fragment>
      <PageMetadata title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <SearchScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <SpacedRow>
              <ScreenTitle>
                {t(['common', 'search', 'search-results'])}
                <SearchResultsCount />
              </ScreenTitle>
              <BackgroundFetchIndicator />
            </SpacedRow>
          </ScreenHeader>
          <SearchFilters />
          <SearchResultsHeader />
          <SearchResults />
          <SearchResultsFooter />
          <FundingNotice />
        </SearchScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<SearchPage.Props> = SearchPage

Page.getLayout = undefined
