import type { StringParams } from '@stefanprobst/next-route-manifest'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { AccountScreenWithoutFiltersLayout } from '@/components/account/AccountScreenWithoutFiltersLayout'
import { BackgroundImage } from '@/components/account/BackgroundImage'
import { UsersBackgroundFetchIndicator } from '@/components/account/UsersBackgroundFetchIndicator'
import { UserSearchResults } from '@/components/account/UserSearchResults'
import { UserSearchResultsFooter } from '@/components/account/UserSearchResultsFooter'
import { UserSearchResultsHeader } from '@/components/account/UserSearchResultsHeader'
import { UsersSearchResultsCount } from '@/components/account/UsersSearchResultsCount'
import type { SearchFilters } from '@/components/account/useUserSearchFilters'
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

export namespace UsersPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = SearchFilters
  export type Props = WithDictionaries<'authenticated' | 'common'>
}

export async function getStaticProps(
  context: GetStaticPropsContext<UsersPage.PathParams>,
): Promise<GetStaticPropsResult<UsersPage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['authenticated', 'common'])

  return {
    props: {
      dictionaries,
    },
  }
}

export default function UsersPage(_props: UsersPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()

  const title = t(['authenticated', 'pages', 'users'])

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(['common', 'pages', 'home']) },
    {
      href: routes.AccountPage(),
      label: t(['authenticated', 'pages', 'account']),
    },
    {
      href: routes.UsersPage(),
      label: t(['authenticated', 'pages', 'users']),
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
                <UsersSearchResultsCount />
              </ScreenTitle>
              <UsersBackgroundFetchIndicator />
            </SpacedRow>
          </ScreenHeader>
          <UserSearchResultsHeader />
          <UserSearchResults />
          <UserSearchResultsFooter />
          <FundingNotice />
        </AccountScreenWithoutFiltersLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<UsersPage.Props> = UsersPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator'].includes(user.role)
}
