import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { PageMainContent } from '@/lib/core/page/PageMainContent'

export namespace TemplatePage {
  export type PathParamsInput = never
  // export interface PathParamsInput extends ParamsInput {
  //   id: string
  // }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = never
  export type Props = WithDictionaries<'common'>
  // export interface Props extends WithDictionaries<'common'> {
  //   params: PathParams
  // }
}

// import type { GetStaticPathsContext, GetStaticPathsResult } from 'next'
// import { getLocales } from '@/lib/core/i18n/getLocales'
// export async function getStaticPaths(
//   context: GetStaticPathsContext,
// ): Promise<GetStaticPathsResult<TemplatePage.PathParams>> {
//   const locales = getLocales()
//   const paths = locales.map((locale) => {
//     const params = {}
//     return { locale, params }
//   })

//   return {
//     paths,
//     fallback: false,
//   }
// }

export async function getStaticProps(
  context: GetStaticPropsContext<TemplatePage.PathParams>,
): Promise<GetStaticPropsResult<TemplatePage.Props>> {
  const locale = getLocale()
  // const params = context.params as TemplatePage.PathParams
  const messages = await load(locale, ['common'])

  return {
    props: {
      messages,
      // params,
    },
  }
}

export default function TemplatePage(_props: TemplatePage.Props): JSX.Element {
  const { t } = useI18n<'common'>()

  const title = t(['common', 'pages', 'home'])

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <h1>{title}</h1>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<TemplatePage.Props> = TemplatePage

Page.getLayout = undefined
