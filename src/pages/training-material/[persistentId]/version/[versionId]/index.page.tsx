import type { ParamsInput, StringParams } from '@stefanprobst/next-route-manifest'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { Alert } from '@/components/common/Alert'
import { FundingNotice } from '@/components/common/FundingNotice'
import { ItemSearchBar } from '@/components/common/ItemSearchBar'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { BackgroundImage } from '@/components/item/BackgroundImage'
import { ItemAccessibleAtLinks } from '@/components/item/ItemAccessibleAtLinks'
import { ItemActors } from '@/components/item/ItemActors'
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
import { ItemSource } from '@/components/item/ItemSource'
import { ItemTitle } from '@/components/item/ItemTitle'
import { ItemVersionScreenLayout } from '@/components/item/ItemVersionScreenLayout'
import { TrainingMaterialContentContributors } from '@/components/item/TrainingMaterialContentContributors'
import { TrainingMaterialVersionControls } from '@/components/item/TrainingMaterialVersionControls'
import type { TrainingMaterial } from '@/data/sshoc/api/training-material'
import { useTrainingMaterialVersion } from '@/data/sshoc/hooks/training-material'
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

export namespace TrainingMaterialVersionPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: TrainingMaterial['persistentId']
    versionId: TrainingMaterial['id']
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'authenticated' | 'common'> {
    params: PathParams
  }
}

export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<TrainingMaterialVersionPage.PathParams>> {
  const locales = getLocales(context)
  const paths = locales.flatMap((locale) => {
    const persistentIds: Array<TrainingMaterial['persistentId']> = []
    return persistentIds.flatMap((persistentId) => {
      const versionIds: Array<TrainingMaterial['id']> = []
      return versionIds.map((versionId) => {
        const params = { persistentId, versionId: String(versionId) }
        return { locale, params }
      })
    })
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext<TrainingMaterialVersionPage.PathParams>,
): Promise<GetStaticPropsResult<TrainingMaterialVersionPage.Props>> {
  const locale = getLocale(context)
  const params = context.params as TrainingMaterialVersionPage.PathParams
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
      params,
    },
  }
}

export default function TrainingMaterialVersionPage(
  props: TrainingMaterialVersionPage.Props,
): JSX.Element {
  const { persistentId, versionId: _versionId } = props.params
  const versionId = Number(_versionId)
  const _trainingMaterial = useTrainingMaterialVersion({ persistentId, versionId })
  const trainingMaterial = _trainingMaterial.data

  const router = useRouter()
  const { t } = useI18n<'authenticated' | 'common'>()

  const category = trainingMaterial?.category ?? 'training-material'
  const categoryLabel = t(['common', 'item-categories', category, 'one'])
  const label = trainingMaterial?.label ?? categoryLabel

  if (router.isFallback || trainingMaterial == null) {
    return (
      <Fragment>
        <PageMetadata title={label} />
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
      href: routes.SearchPage({ categories: [trainingMaterial.category], order: ['label'] }),
      label: t(['common', 'item-categories', category, 'other']),
    },
    {
      href: routes.TrainingMaterialVersionPage({ persistentId, versionId }),
      label,
    },
  ]

  return (
    <Fragment>
      {/* TODO: strip markdown from description (synchronously) */}
      <PageMetadata title={trainingMaterial.label} description={trainingMaterial.description} />
      <PageMainContent>
        <ItemVersionScreenLayout>
          <BackgroundImage />
          <Alert color="notice">
            {t(['authenticated', 'item-status-alert'], {
              values: {
                category: categoryLabel,
                status: t(['common', 'item-status', trainingMaterial.status]),
              },
            })}
          </Alert>
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ItemTitle category={trainingMaterial.category} thumbnail={trainingMaterial.thumbnail}>
              {trainingMaterial.label}
            </ItemTitle>
          </ScreenHeader>
          <ItemHeader>
            <TrainingMaterialVersionControls
              persistentId={trainingMaterial.persistentId}
              versionId={trainingMaterial.id}
            />
            <ItemDescription description={trainingMaterial.description} />
          </ItemHeader>
          <ItemInfo>
            <ItemAccessibleAtLinks
              category={trainingMaterial.category}
              links={trainingMaterial.accessibleAt}
            />
            <ItemMetadata>
              <ItemProperties properties={trainingMaterial.properties} />
              <ItemActors actors={trainingMaterial.contributors} />
              <ItemSource source={trainingMaterial.source} id={trainingMaterial.sourceItemId} />
              <ItemExternalIds ids={trainingMaterial.externalIds} />
              <ItemDateCreated dateTime={trainingMaterial.dateCreated} />
              <ItemDateLastUpdated dateTime={trainingMaterial.dateLastUpdated} />
              {/* <Suspense fallback={<LoadingIndicator />}> */}
              <TrainingMaterialContentContributors
                persistentId={trainingMaterial.persistentId}
                versionId={trainingMaterial.id}
              />
              {/* </Suspense> */}
            </ItemMetadata>
          </ItemInfo>
          <ItemDetails>
            <ItemMedia media={trainingMaterial.media} />
            <ItemRelatedItems items={trainingMaterial.relatedItems} />
          </ItemDetails>
          <FundingNotice />
        </ItemVersionScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<TrainingMaterialVersionPage.Props> = TrainingMaterialVersionPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
