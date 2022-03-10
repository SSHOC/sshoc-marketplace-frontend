import type { ParamsInput, StringParams } from '@stefanprobst/next-route-manifest'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ItemSearchBar } from '@/components/common/ItemSearchBar'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/item-history/BackgroundImage'
import { Content } from '@/components/item-history/Content'
import { ItemHistoryScreenLayout } from '@/components/item-history/ItemHistoryScreenLayout'
import { PublicationHistorySearchResults } from '@/components/item-history/PublicationHistorySearchResults'
import type { Publication } from '@/data/sshoc/api/publication'
import { usePublicationHistory } from '@/data/sshoc/hooks/publication'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { getLocales } from '@/lib/core/i18n/getLocales'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import { Breadcrumbs } from '@/lib/core/ui/Breadcrumbs/Breadcrumbs'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'

export namespace PublicationHistoryPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Publication['persistentId']
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'authenticated' | 'common'> {
    params: PathParams
  }
}

export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<PublicationHistoryPage.PathParams>> {
  const locales = getLocales(context)
  const paths = locales.flatMap((locale) => {
    const persistentIds: Array<Publication['persistentId']> = []
    return persistentIds.map((persistentId) => {
      const params = { persistentId }
      return { locale, params }
    })
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext<PublicationHistoryPage.PathParams>,
): Promise<GetStaticPropsResult<PublicationHistoryPage.Props>> {
  const locale = getLocale(context)
  const params = context.params as PublicationHistoryPage.PathParams
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
      params,
    },
  }
}

export default function PublicationHistoryPage(props: PublicationHistoryPage.Props): JSX.Element {
  const { persistentId } = props.params
  const publicationHistory = usePublicationHistory({ persistentId })

  const router = useRouter()
  const { t } = useI18n<'authenticated' | 'common'>()

  const publication = publicationHistory.data?.find((item) => {
    return item.status === 'approved'
  })
  const category = publication?.category ?? 'publication'
  const label = publication?.label ?? t(['common', 'item-categories', category, 'one'])
  const title = t(['authenticated', 'item-history', 'item-history'], { values: { item: label } })

  if (router.isFallback || publicationHistory.data == null) {
    return (
      <Fragment>
        <PageMetadata title={title} />
        <PageMainContent>
          <FullPage>
            <Centered>
              <ProgressSpinner />
            </Centered>
          </FullPage>
        </PageMainContent>
      </Fragment>
    )
  }

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(['common', 'pages', 'home']) },
    {
      href: routes.SearchPage({ categories: [category], order: ['label'] }),
      label: t(['common', 'item-categories', category, 'other']),
    },
    {
      href: routes.PublicationPage({ persistentId }),
      label,
    },
    {
      href: routes.PublicationHistoryPage({ persistentId }),
      label: t(['authenticated', 'pages', 'item-version-history']),
    },
  ]

  return (
    <Fragment>
      <PageMetadata title={title} />
      <PageMainContent>
        <ItemHistoryScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <Content>
            <PublicationHistorySearchResults persistentId={persistentId} />
          </Content>
          <FundingNotice />
        </ItemHistoryScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<PublicationHistoryPage.Props> = PublicationHistoryPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
