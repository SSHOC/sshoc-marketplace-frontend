import type { GetStaticPropsResult } from 'next'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { ErrorMessage } from '@/components/common/ErrorMessage'
import { FundingNotice } from '@/components/common/FundingNotice'
import { LinkButton } from '@/components/common/LinkButton'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/error/BackgroundImage'
import { Content } from '@/components/error/Content'
import { ErrorScreenLayout } from '@/components/error/ErrorScreenLayout'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { PageMainContent } from '@/lib/core/page/PageMainContent'

export namespace NotFoundPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export type Props = WithDictionaries<'common'>
}

export async function getStaticProps(): Promise<GetStaticPropsResult<NotFoundPage.Props>> {
  const locale = getLocale()
  const messages = await load(locale, ['common'])

  return {
    props: {
      messages,
    },
  }
}

export default function NotFoundPage(_props: NotFoundPage.Props): JSX.Element {
  const t = useTranslations('common')

  const title = t('pages.internal-server-error')
  const message = t('internal-server-error-message')

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <ErrorScreenLayout>
          <BackgroundImage />
          <Content>
            <ScreenTitle>{title}</ScreenTitle>
            <ErrorMessage message={message} statusCode={500} />
            <div>
              <LinkButton href="/" color="secondary">
                {t('go-to-main-page')}
              </LinkButton>
            </div>
          </Content>
          <FundingNotice />
        </ErrorScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<NotFoundPage.Props> = NotFoundPage

Page.getLayout = undefined
