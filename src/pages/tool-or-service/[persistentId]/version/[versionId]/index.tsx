import { createUrlSearchParams } from '@stefanprobst/request'
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
import { ToolOrServiceContentContributors } from '@/components/item/ToolOrServiceContentContributors'
import { ToolOrServiceVersionControls } from '@/components/item/ToolOrServiceVersionControls'
import type { Tool } from '@/data/sshoc/api/tool-or-service'
import { useTool, useToolVersion } from '@/data/sshoc/hooks/tool-or-service'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { getLocales } from '@/lib/core/i18n/getLocales'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { useSearchParams } from '@/lib/core/navigation/useSearchParams'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import { Breadcrumbs } from '@/lib/core/ui/Breadcrumbs/Breadcrumbs'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'

export namespace ToolOrServiceVersionPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Tool['persistentId']
    versionId: Tool['id']
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'authenticated' | 'common'> {
    params: PathParams
  }
}

export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<ToolOrServiceVersionPage.PathParams>> {
  const locales = getLocales(context)
  const paths = locales.flatMap((locale) => {
    const persistentIds: Array<Tool['persistentId']> = []
    return persistentIds.flatMap((persistentId) => {
      const versionIds: Array<Tool['id']> = []
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
  context: GetStaticPropsContext<ToolOrServiceVersionPage.PathParams>,
): Promise<GetStaticPropsResult<ToolOrServiceVersionPage.Props>> {
  const locale = getLocale(context)
  const params = context.params as ToolOrServiceVersionPage.PathParams
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
      params,
    },
  }
}

export default function ToolOrServiceVersionPage(
  props: ToolOrServiceVersionPage.Props,
): JSX.Element {
  const router = useRouter()
  const { persistentId, versionId: _versionId } = props.params
  const versionId = Number(_versionId)
  const searchParams = useSearchParams()
  const isDraftVersion = searchParams != null && searchParams.get('draft') != null
  const _toolOrService = !isDraftVersion
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useToolVersion({ persistentId, versionId }, undefined, { enabled: router.isReady })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useTool({ persistentId, draft: true }, undefined, { enabled: router.isReady })
  const toolOrService = _toolOrService.data

  const { t } = useI18n<'authenticated' | 'common'>()

  const category = toolOrService?.category ?? 'tool-or-service'
  const categoryLabel = t(['common', 'item-categories', category, 'one'])
  const label = toolOrService?.label ?? categoryLabel

  if (router.isFallback || toolOrService == null) {
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
    { href: '/', label: t(['common', 'pages', 'home']) },
    {
      href: `/search?${createUrlSearchParams({ categories: [toolOrService.category], order: ['label'] })}`,
      label: t(['common', 'item-categories', category, 'other']),
    },
    {
      href: `/tool-or-service/${persistentId}/versions/${versionId}`,
      label,
    },
  ]

  return (
    <Fragment>
      {/* TODO: strip markdown from description (synchronously) */}
      <PageMetadata
        title={toolOrService.label}
        description={toolOrService.description}
        openGraph={{}}
        twitter={{}}
      />
      <PageMainContent>
        <ItemVersionScreenLayout>
          <BackgroundImage />
          <Alert color="notice">
            {t(['authenticated', 'item-status-alert'], {
              values: {
                category: categoryLabel,
                status: t(['common', 'item-status', toolOrService.status]),
              },
            })}
          </Alert>
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ItemTitle category={toolOrService.category} thumbnail={toolOrService.thumbnail}>
              {toolOrService.label}
            </ItemTitle>
          </ScreenHeader>
          <ItemHeader>
            <ToolOrServiceVersionControls
              persistentId={toolOrService.persistentId}
              status={toolOrService.status}
              versionId={toolOrService.id}
            />
            <ItemDescription description={toolOrService.description} />
          </ItemHeader>
          <ItemInfo>
            <ItemAccessibleAtLinks
              category={toolOrService.category}
              links={toolOrService.accessibleAt}
            />
            <ItemMetadata>
              <ItemProperties properties={toolOrService.properties} />
              <ItemActors actors={toolOrService.contributors} />
              <ItemSource source={toolOrService.source} id={toolOrService.sourceItemId} />
              <ItemExternalIds ids={toolOrService.externalIds} />
              <ItemDateCreated dateTime={toolOrService.dateCreated} />
              <ItemDateLastUpdated dateTime={toolOrService.dateLastUpdated} />
              {/* <Suspense fallback={<LoadingIndicator />}> */}
              <ToolOrServiceContentContributors
                persistentId={toolOrService.persistentId}
                versionId={toolOrService.id}
              />
              {/* </Suspense> */}
            </ItemMetadata>
          </ItemInfo>
          <ItemDetails>
            <ItemMedia media={toolOrService.media} />
            <ItemRelatedItems items={toolOrService.relatedItems} />
          </ItemDetails>
          <FundingNotice />
        </ItemVersionScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<ToolOrServiceVersionPage.Props> = ToolOrServiceVersionPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
