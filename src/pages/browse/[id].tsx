import type { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { BackgroundImage } from '@/components/browse/BackgroundImage'
import { BrowseFacets } from '@/components/browse/BrowseFacets'
import { BrowseFacetValues } from '@/components/browse/BrowseFacetValues'
import { BrowseScreenLayout } from '@/components/browse/BrowseScreenLayout'
import { FundingNotice } from '@/components/common/FundingNotice'
import { ItemSearchBar } from '@/components/common/ItemSearchBar'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import type { ItemFacet } from '@/data/sshoc/api/item'
import { itemFacets } from '@/data/sshoc/api/item'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { getLocales } from '@/lib/core/i18n/getLocales'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import { Breadcrumbs } from '@/lib/core/ui/Breadcrumbs/Breadcrumbs'

export namespace BrowsePage {
  export interface PathParamsInput extends ParamsInput {
    id: ItemFacet
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'common'> {
    params: PathParams
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult<BrowsePage.PathParams>> {
  const locales = getLocales()
  const paths = locales.flatMap((locale) => {
    return itemFacets.map((id) => {
      const params = { id }
      return { locale, params }
    })
  })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext<BrowsePage.PathParams>,
): Promise<GetStaticPropsResult<BrowsePage.Props>> {
  const locale = getLocale()
  const params = context.params as BrowsePage.PathParams
  const messages = await load(locale, ['common'])

  return {
    props: {
      messages,
      params,
    },
  }
}

export default function BrowsePage(props: BrowsePage.Props): JSX.Element {
  const id = props.params.id as ItemFacet

  const t = useTranslations('common')

  const title = t('browse.browse-facet', {
    facet: t(`facets.${id}.other`),
  })

  const breadcrumbs = [
    { href: '/', label: t('pages.home') },
    { href: `/browse/${id}`, label: title },
  ]

  return (
    <Fragment>
      <PageMetadata title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <BrowseScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <BrowseFacets>
            {/* <Suspense
              fallback={
                <Centered>
                  <LoadingIndicator />
                </Centered>
              }
            > */}
            <BrowseFacetValues facet={id} />
            {/* </Suspense> */}
          </BrowseFacets>
          <FundingNotice />
        </BrowseScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<BrowsePage.Props> = BrowsePage

Page.getLayout = undefined
