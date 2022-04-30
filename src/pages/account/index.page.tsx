import type { StringParams } from '@stefanprobst/next-route-manifest'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { AccountHelpText } from '@/components/account/AccountHelpText'
import { AccountLinks } from '@/components/account/AccountLinks'
import { AccountScreenLayout } from '@/components/account/AccountScreenLayout'
import { BackgroundImage } from '@/components/account/BackgroundImage'
import { Content } from '@/components/account/Content'
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

export namespace AccountPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export type Props = WithDictionaries<'authenticated' | 'common'>
}

export async function getStaticProps(
  context: GetStaticPropsContext<AccountPage.PathParams>,
): Promise<GetStaticPropsResult<AccountPage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['authenticated', 'common'])

  return {
    props: {
      dictionaries,
    },
  }
}

export default function AccountPage(_props: AccountPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()

  const title = t(['authenticated', 'pages', 'account'])

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(['common', 'pages', 'home']) },
    {
      href: routes.AccountPage(),
      label: t(['authenticated', 'pages', 'account']),
    },
  ]

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <AccountScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <Breadcrumbs links={breadcrumbs} />
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <Content>
            <AccountHelpText />
            <AccountLinks />
          </Content>
          <FundingNotice />
        </AccountScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<AccountPage.Props> = AccountPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
