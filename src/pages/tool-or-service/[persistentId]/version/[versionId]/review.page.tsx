import type { ParamsInput, StringParams } from '@stefanprobst/next-route-manifest'
import type { FormApi, SubmissionErrors } from 'final-form'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/item-form/BackgroundImage'
import { Content } from '@/components/item-form/Content'
import type { ItemFormValues } from '@/components/item-form/ItemForm'
import { ItemFormScreenLayout } from '@/components/item-form/ItemFormScreenLayout'
import { ItemReviewForm } from '@/components/item-form/ItemReviewForm'
import { useCreateOrUpdateTool } from '@/components/item-form/useCreateOrUpdateTool'
import { useReviewItemMeta } from '@/components/item-form/useReviewItemMeta'
import { useToolFormFields } from '@/components/item-form/useToolFormFields'
import { useToolValidationSchema } from '@/components/item-form/useToolValidationSchema'
import type { Tool, ToolInput } from '@/data/sshoc/api/tool-or-service'
import {
  useRejectToolVersion,
  useToolDiff,
  useToolVersion,
} from '@/data/sshoc/hooks/tool-or-service'
import { isNotFoundError } from '@/data/sshoc/utils/isNotFoundError'
import type { PageComponent } from '@/lib/core/app/types'
import { FORM_ERROR } from '@/lib/core/form/Form'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { getLocales } from '@/lib/core/i18n/getLocales'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import type { QueryMetadata } from '@/lib/core/query/types'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'

export type UpdateToolOrServiceFormValues = ItemFormValues<ToolInput>

export namespace ReviewToolOrServicePage {
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
): Promise<GetStaticPathsResult<ReviewToolOrServicePage.PathParams>> {
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
  context: GetStaticPropsContext<ReviewToolOrServicePage.PathParams>,
): Promise<GetStaticPropsResult<ReviewToolOrServicePage.Props>> {
  const locale = getLocale(context)
  const params = context.params as ReviewToolOrServicePage.PathParams
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
      params,
    },
  }
}

export default function ReviewToolOrServicePage(props: ReviewToolOrServicePage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()
  const router = useRouter()

  const { persistentId, versionId: _versionId } = props.params
  const versionId = Number(_versionId)
  const _tool = useToolVersion({ persistentId, versionId }, undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  const tool = _tool.data
  /** For newly suggested items there will be no diff available. */
  const ignoreMissingDiff: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false
        return undefined
      },
    },
  }
  const _diff = useToolDiff(
    { persistentId, with: persistentId, otherVersionId: versionId },
    undefined,
    {
      meta: ignoreMissingDiff,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )
  const diff = _diff.data
  const diffNotFound = isNotFoundError(_diff.error)

  const category = tool?.category ?? 'tool-or-service'
  const label = t(['common', 'item-categories', category, 'one'])
  const title = t(['authenticated', 'forms', 'edit-item'], { values: { item: label } })

  const formFields = useToolFormFields()
  const validate = useToolValidationSchema()
  const meta = useReviewItemMeta({ category })
  const createOrUpdateToolOrService = useCreateOrUpdateTool(undefined, {
    meta: meta.approve,
  })
  const rejectToolOrServiceVersion = useRejectToolVersion({ persistentId, versionId }, undefined, {
    meta: meta.reject,
  })

  function onSubmit(
    values: UpdateToolOrServiceFormValues,
    form: FormApi<UpdateToolOrServiceFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    delete values['__submitting__']

    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    createOrUpdateToolOrService.mutate(
      { data: values, draft: shouldSaveAsDraft },
      {
        onSuccess(tool) {
          if (tool.status === 'draft') {
            // FIXME: Probably better to keep this state in useCreateOrUpdateToolOrService.
            form.batch(() => {
              form.change('persistentId', tool.persistentId)
              form.change('status', tool.status)
            })
            window.scrollTo(0, 0)
          } else if (tool.status === 'approved') {
            router.push(routes.ToolOrServicePage({ persistentId: tool.persistentId }))
          } else {
            router.push(routes.SuccessPage())
          }
          done?.()
        },
        onError(error) {
          done?.({ [FORM_ERROR]: String(error) })
        },
      },
    )
  }

  function onReject() {
    rejectToolOrServiceVersion.mutate()
  }

  function onCancel() {
    router.push(routes.AccountPage())
  }

  if (router.isFallback || tool == null || (diff == null && !diffNotFound)) {
    return (
      <Fragment>
        <PageMetadata title={title} openGraph={{}} twitter={{}} />
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

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <ItemFormScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <Content>
            <ItemReviewForm<UpdateToolOrServiceFormValues>
              formFields={formFields}
              name="review-item"
              initialValues={tool}
              diff={diff}
              onCancel={onCancel}
              onReject={onReject}
              onSubmit={onSubmit}
              validate={validate}
            />
          </Content>
          <FundingNotice />
        </ItemFormScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<ReviewToolOrServicePage.Props> = ReviewToolOrServicePage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator'].includes(user.role)
}
