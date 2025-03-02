import { createUrlSearchParams, HttpError } from '@stefanprobst/request'
import type { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'
import { dehydrate, QueryClient, useQueryClient } from 'react-query'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ItemSearchBar } from '@/components/common/ItemSearchBar'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { BackgroundImage } from '@/components/item/BackgroundImage'
import { DatasetContentContributors } from '@/components/item/DatasetContentContributors'
import { DatasetControls } from '@/components/item/DatasetControls'
import { DatasetSchemaOrgMetadata } from '@/components/item/DatasetSchemaOrgMetadata'
import { ItemAccessibleAtLinks } from '@/components/item/ItemAccessibleAtLinks'
import { ItemActors } from '@/components/item/ItemActors'
import { ItemCitation } from '@/components/item/ItemCitation'
import { ItemComments } from '@/components/item/ItemComments'
import { ItemDateCreated } from '@/components/item/ItemDateCreated'
import { ItemDateLastUpdated } from '@/components/item/ItemDateLastUpdated'
import { ItemDescription } from '@/components/item/ItemDescription'
import { ItemDetails } from '@/components/item/ItemDetails'
import { ItemExternalIds } from '@/components/item/ItemExternalIds'
import { ItemHeader } from '@/components/item/ItemHeader'
import { ItemInfo } from '@/components/item/ItemInfo'
import { ItemMedia } from '@/components/item/ItemMedia'
import { ItemMetadata } from '@/components/item/ItemMetadata'
import { ItemProperties } from '@/components/item/ItemProperties'
import { ItemRelatedItems } from '@/components/item/ItemRelatedItems'
import { ItemScreenLayout } from '@/components/item/ItemScreenLayout'
import { ItemSource } from '@/components/item/ItemSource'
import { ItemTitle } from '@/components/item/ItemTitle'
import type { Dataset } from '@/data/sshoc/api/dataset'
import { getDataset } from '@/data/sshoc/api/dataset'
import { keys, useDataset } from '@/data/sshoc/hooks/dataset'
import { isNotFoundError } from '@/data/sshoc/utils/isNotFoundError'
import type { PageComponent, SharedPageProps } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import { Breadcrumbs } from '@/lib/core/ui/Breadcrumbs/Breadcrumbs'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'

export namespace DatasetPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Dataset['persistentId']
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'common'> {
    params: PathParams
    initialQueryState: SharedPageProps['initialQueryState']
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult<DatasetPage.PathParams>> {
  const persistentIds: Array<Dataset['persistentId']> = []

  const paths = persistentIds.map((persistentId) => {
    const params = { persistentId }
    return { params }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext<DatasetPage.PathParams>,
): Promise<GetStaticPropsResult<DatasetPage.Props>> {
  const locale = getLocale()
  const params = context.params as DatasetPage.PathParams
  const messages = await load(locale, ['common'])

  try {
    const persistentId = params.persistentId
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery(keys.detail({ persistentId }), () => {
      return getDataset({ persistentId })
    })

    return {
      props: {
        messages,
        params,
        initialQueryState: dehydrate(queryClient),
      },
    }
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        notFound: true,
      }
    }

    throw error
  }
}

export default function DatasetPage(props: DatasetPage.Props): JSX.Element {
  const { persistentId } = props.params
  const queryClient = useQueryClient()
  const _dataset = useDataset({ persistentId }, undefined, {
    /** Pre-populate cache with data fetched server-side without authentication in `getStaticProps`. */
    initialData: queryClient.getQueryData(keys.detail({ persistentId })),
  })
  const dataset = _dataset.data

  const router = useRouter()
  const t = useTranslations('common')
  const category = dataset?.category ?? 'dataset'
  const label = dataset?.label ?? t(`item-categories.${category}.one`)

  if (
    _dataset.error != null &&
    _dataset.error instanceof HttpError &&
    _dataset.error.response.status === 404
  ) {
    router.push('/404')
  }

  if (router.isFallback || dataset == null) {
    return (
      <Fragment>
        <PageMetadata title={label} openGraph={{}} twitter={{}} />
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
    { href: '/', label: t('pages.home') },
    {
      href: `/search?${createUrlSearchParams({ categories: [dataset.category], order: ['label'] })}`,
      label: t(`item-categories.${dataset.category}.other`),
    },
    {
      href: `/dataset/${persistentId}`,
      label,
    },
  ]

  return (
    <Fragment>
      {/* TODO: strip markdown from description (synchronously) */}
      <PageMetadata
        title={dataset.label}
        description={dataset.description}
        openGraph={{}}
        twitter={{}}
      />
      <DatasetSchemaOrgMetadata dataset={dataset} />
      <PageMainContent>
        <ItemScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ItemTitle category={dataset.category} thumbnail={dataset.thumbnail}>
              {dataset.label}
            </ItemTitle>
          </ScreenHeader>
          <ItemHeader>
            <DatasetControls persistentId={dataset.persistentId} />
            <ItemDescription description={dataset.description} />
          </ItemHeader>
          <ItemInfo>
            <ItemAccessibleAtLinks category={dataset.category} links={dataset.accessibleAt} />
            <ItemMetadata>
              <ItemProperties properties={dataset.properties} />
              <ItemActors actors={dataset.contributors} />
              <ItemSource source={dataset.source} id={dataset.sourceItemId} />
              <ItemExternalIds ids={dataset.externalIds} />
              <ItemDateCreated dateTime={dataset.dateCreated} />
              <ItemDateLastUpdated dateTime={dataset.dateLastUpdated} />
              {/* <Suspense fallback={<LoadingIndicator />}> */}
              <DatasetContentContributors
                persistentId={dataset.persistentId}
                versionId={dataset.id}
              />
              {/* </Suspense> */}
              <ItemCitation item={dataset} />
            </ItemMetadata>
          </ItemInfo>
          <ItemDetails>
            <ItemMedia media={dataset.media} />
            <ItemRelatedItems items={dataset.relatedItems} />
          </ItemDetails>
          <ItemComments persistentId={dataset.persistentId} />
          <FundingNotice />
        </ItemScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<DatasetPage.Props> = DatasetPage

Page.getLayout = undefined
