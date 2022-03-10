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
import { WorkflowContentContributors } from '@/components/item/WorkflowContentContributors'
import { WorkflowVersionControls } from '@/components/item/WorkflowVersionControls'
import type { Workflow } from '@/data/sshoc/api/workflow'
import { useWorkflowVersion } from '@/data/sshoc/hooks/workflow'
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

export namespace WorkflowVersionPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Workflow['persistentId']
    versionId: Workflow['id']
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'authenticated' | 'common'> {
    params: PathParams
  }
}

export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<WorkflowVersionPage.PathParams>> {
  const locales = getLocales(context)
  const paths = locales.flatMap((locale) => {
    const persistentIds: Array<Workflow['persistentId']> = []
    return persistentIds.flatMap((persistentId) => {
      const versionIds: Array<Workflow['id']> = []
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
  context: GetStaticPropsContext<WorkflowVersionPage.PathParams>,
): Promise<GetStaticPropsResult<WorkflowVersionPage.Props>> {
  const locale = getLocale(context)
  const params = context.params as WorkflowVersionPage.PathParams
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
      params,
    },
  }
}

export default function WorkflowVersionPage(props: WorkflowVersionPage.Props): JSX.Element {
  const { persistentId, versionId: _versionId } = props.params
  const versionId = Number(_versionId)
  const _workflow = useWorkflowVersion({ persistentId, versionId })
  const workflow = _workflow.data

  const router = useRouter()
  const { t } = useI18n<'authenticated' | 'common'>()

  const category = workflow?.category ?? 'workflow'
  const label = workflow?.label ?? t(['common', 'item-categories', category, 'one'])

  if (router.isFallback || workflow == null) {
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
      href: routes.SearchPage({ categories: [workflow.category], order: ['label'] }),
      label: t(['common', 'item-categories', category, 'other']),
    },
    {
      href: routes.WorkflowVersionPage({ persistentId, versionId }),
      label,
    },
  ]

  return (
    <Fragment>
      {/* TODO: strip markdown from description (synchronously) */}
      <PageMetadata title={workflow.label} description={workflow.description} />
      <PageMainContent>
        <ItemVersionScreenLayout>
          <BackgroundImage />
          <Alert color="notice">
            {t(['authenticated', 'item-status-alert'], {
              values: { category: label, status: t(['common', 'item-status', workflow.status]) },
            })}
          </Alert>
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ItemTitle category={workflow.category} thumbnail={workflow.thumbnail}>
              {workflow.label}
            </ItemTitle>
          </ScreenHeader>
          <ItemHeader>
            <WorkflowVersionControls persistentId={workflow.persistentId} versionId={workflow.id} />
            <ItemDescription description={workflow.description} />
          </ItemHeader>
          <ItemInfo>
            <ItemAccessibleAtLinks category={workflow.category} links={workflow.accessibleAt} />
            <ItemMetadata>
              <ItemProperties properties={workflow.properties} />
              <ItemActors actors={workflow.contributors} />
              <ItemSource source={workflow.source} id={workflow.sourceItemId} />
              <ItemExternalIds ids={workflow.externalIds} />
              <ItemDateCreated dateTime={workflow.dateCreated} />
              <ItemDateLastUpdated dateTime={workflow.dateLastUpdated} />
              {/* <Suspense fallback={<LoadingIndicator />}> */}
              <WorkflowContentContributors
                persistentId={workflow.persistentId}
                versionId={workflow.id}
              />
              {/* </Suspense> */}
            </ItemMetadata>
          </ItemInfo>
          <ItemDetails>
            <ItemMedia media={workflow.media} />
            <ItemRelatedItems items={workflow.relatedItems} />
          </ItemDetails>
          <FundingNotice />
        </ItemVersionScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<WorkflowVersionPage.Props> = WorkflowVersionPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
