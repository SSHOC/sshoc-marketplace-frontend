import type { GetStaticPropsResult } from 'next'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { FundingNotice } from '@/components/common/FundingNotice'
import { LinkButton } from '@/components/common/LinkButton'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundGradient } from '@/components/success/BackgroundGradient'
import { SuccessCard } from '@/components/success/SuccessCard'
import { SuccessCardControls } from '@/components/success/SuccessCardControls'
import { SuccessScreenLayout } from '@/components/success/SuccessScreenLayout'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { PageMainContent } from '@/lib/core/page/PageMainContent'

export namespace SuccessPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export type Props = WithDictionaries<'common'>
}

export async function getStaticProps(): Promise<GetStaticPropsResult<SuccessPage.Props>> {
  const locale = getLocale()
  const messages = await load(locale, ['common'])

  return {
    props: {
      messages,
    },
  }
}

export default function SuccessPage(_props: SuccessPage.Props): JSX.Element {
  const t = useTranslations('common')

  const title = t('pages.success')

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <SuccessScreenLayout>
          <BackgroundGradient />
          <SuccessCard>
            <ScreenHeader>
              <ScreenTitle>{t('success.title')}</ScreenTitle>
            </ScreenHeader>
            <p>{t('success.message')}</p>
            <SuccessCardControls>
              <LinkButton href="/">{t('success.back-home')}</LinkButton>
            </SuccessCardControls>
          </SuccessCard>
          <FundingNotice />
        </SuccessScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<SuccessPage.Props> = SuccessPage

Page.getLayout = undefined
