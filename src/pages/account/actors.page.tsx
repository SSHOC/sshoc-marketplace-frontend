import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { AccountScreenWithoutFiltersLayout } from '@/components/account/AccountScreenWithoutFiltersLayout'
import { ActorsBackgroundFetchIndicator } from '@/components/account/ActorsBackgroundFetchIndicator'
import { ActorSearchResults } from '@/components/account/ActorSearchResults'
import { ActorSearchResultsFooter } from '@/components/account/ActorSearchResultsFooter'
import { ActorSearchResultsHeader } from '@/components/account/ActorSearchResultsHeader'
import { ActorsSearchResultsCount } from '@/components/account/ActorsSearchResultsCount'
import { BackgroundImage } from '@/components/account/BackgroundImage'
import type { SearchFilters } from '@/components/account/useActorSearchFilters'
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

export namespace ActorsPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = SearchFilters
  export type Props = WithDictionaries<'authenticated' | 'common'>
}

export async function getStaticProps(
  context: GetStaticPropsContext<ActorsPage.PathParams>,
): Promise<GetStaticPropsResult<ActorsPage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['authenticated', 'common'])

  return {
    props: {
      dictionaries,
    },
  }
}

export default function ActorsPage(_props: ActorsPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()

  const title = t(['authenticated', 'pages', 'actors'])

  const breadcrumbs = [
    { href: '/', label: t(['common', 'pages', 'home']) },
    {
      href: `/account`,
      label: t(['authenticated', 'pages', 'account']),
    },
    {
      href: `/account/actors`,
      label: t(['authenticated', 'pages', 'actors']),
    },
  ]

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <AccountScreenWithoutFiltersLayout>
          <BackgroundImage />
          <ScreenHeader>
            <Breadcrumbs links={breadcrumbs} />
            <SpacedRow>
              <ScreenTitle>
                {title}
                <ActorsSearchResultsCount />
              </ScreenTitle>
              <ActorsBackgroundFetchIndicator />
            </SpacedRow>
          </ScreenHeader>
          <ActorSearchResultsHeader />
          <ActorSearchResults />
          <ActorSearchResultsFooter />
          <FundingNotice />
        </AccountScreenWithoutFiltersLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<ActorsPage.Props> = ActorsPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator'].includes(user.role)
}
