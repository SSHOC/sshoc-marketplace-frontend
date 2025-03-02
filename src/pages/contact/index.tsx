import type { GetStaticPropsResult } from 'next'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { FundingNotice } from '@/components/common/FundingNotice'
import { Image } from '@/components/common/Image'
import { ItemSearchBar } from '@/components/common/ItemSearchBar'
import { Link } from '@/components/common/Link'
import { Prose } from '@/components/common/Prose'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/contact/BackgroundImage'
import Contact, { metadata } from '@/components/contact/Contact.mdx'
import type { ContactFormValues } from '@/components/contact/ContactForm'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactScreenLayout } from '@/components/contact/ContactScreenLayout'
import { Content } from '@/components/contact/Content'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import { Breadcrumbs } from '@/lib/core/ui/Breadcrumbs/Breadcrumbs'

export namespace ContactPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Partial<ContactFormValues>
  export type Props = WithDictionaries<'common'>
}

export async function getStaticProps(): Promise<GetStaticPropsResult<ContactPage.Props>> {
  const locale = getLocale()
  const messages = await load(locale, ['common'])

  return {
    props: {
      messages,
    },
  }
}

export default function ContactPage(_props: ContactPage.Props): JSX.Element {
  const t = useTranslations('common')

  const title = t('pages.contact')

  const breadcrumbs = [
    { href: '/', label: t('pages.home') },
    { href: '/contact', label: t('pages.contact') },
  ]

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <ContactScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ScreenTitle>{metadata.title}</ScreenTitle>
          </ScreenHeader>
          <Content>
            <Prose>
              <Contact components={{ Image, Link }} />
            </Prose>
          </Content>
          <ContactForm />
          <FundingNotice />
        </ContactScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<ContactPage.Props> = ContactPage

Page.getLayout = undefined
