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
import { useCreateOrUpdateDataset } from '@/components/item-form/useCreateOrUpdateDataset'
import { useDatasetFormFields } from '@/components/item-form/useDatasetFormFields'
import { useDatasetValidationSchema } from '@/components/item-form/useDatasetValidationSchema'
import { useReviewItemMeta } from '@/components/item-form/useReviewItemMeta'
import type { Dataset, DatasetInput } from '@/data/sshoc/api/dataset'
import {
  useDatasetDiff,
  useDatasetVersion,
  useRejectDatasetVersion,
} from '@/data/sshoc/hooks/dataset'
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

export type UpdateDatasetFormValues = ItemFormValues<DatasetInput>

export namespace ReviewDatasetPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Dataset['persistentId']
    versionId: Dataset['id']
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'authenticated' | 'common'> {
    params: PathParams
  }
}

export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<ReviewDatasetPage.PathParams>> {
  const locales = getLocales(context)
  const paths = locales.flatMap((locale) => {
    const persistentIds: Array<Dataset['persistentId']> = []
    return persistentIds.flatMap((persistentId) => {
      const versionIds: Array<Dataset['id']> = []
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
  context: GetStaticPropsContext<ReviewDatasetPage.PathParams>,
): Promise<GetStaticPropsResult<ReviewDatasetPage.Props>> {
  const locale = getLocale(context)
  const params = context.params as ReviewDatasetPage.PathParams
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
      params,
    },
  }
}

export default function ReviewDatasetPage(props: ReviewDatasetPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()
  const router = useRouter()

  const { persistentId, versionId: _versionId } = props.params
  const versionId = Number(_versionId)
  const _dataset = useDatasetVersion({ persistentId, versionId }, undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  const dataset = _dataset.data
  /** For newly suggested items there will be no diff available. */
  const ignoreMissingDiff: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false
        return undefined
      },
    },
  }
  const _diff = useDatasetDiff(
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

  const category = dataset?.category ?? 'dataset'
  const label = t(['common', 'item-categories', category, 'one'])
  const title = t(['authenticated', 'forms', 'edit-item'], { values: { item: label } })

  const formFields = useDatasetFormFields()
  const validate = useDatasetValidationSchema()
  const meta = useReviewItemMeta({ category })
  const createOrUpdateDataset = useCreateOrUpdateDataset(undefined, { meta: meta.approve })
  const rejectDatasetVersion = useRejectDatasetVersion({ persistentId, versionId }, undefined, {
    meta: meta.reject,
  })

  function onSubmit(
    values: UpdateDatasetFormValues,
    form: FormApi<UpdateDatasetFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    // UPSTREAM: Add `setFormData` to `final-form` to store form-wide metadata instead of passing via form values.
    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    createOrUpdateDataset.mutate(
      { data: values, draft: shouldSaveAsDraft },
      {
        onSuccess(dataset) {
          if (dataset.status === 'draft') {
            // FIXME: Probably better to keep this state in useCreateOrUpdateDataset.
            form.batch(() => {
              form.change('persistentId', dataset.persistentId)
              form.change('status', dataset.status)
            })
            window.scrollTo(0, 0)
          } else if (dataset.status === 'approved') {
            router.push(routes.DatasetPage({ persistentId: dataset.persistentId }))
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
    rejectDatasetVersion.mutate()
  }

  function onCancel() {
    router.push(routes.AccountPage())
  }

  if (router.isFallback || dataset == null || (diff == null && !diffNotFound)) {
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

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} />
      <PageMainContent>
        <ItemFormScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <Content>
            <ItemReviewForm<UpdateDatasetFormValues>
              formFields={formFields}
              name="review-item"
              initialValues={dataset}
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

const Page: PageComponent<ReviewDatasetPage.Props> = ReviewDatasetPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator'].includes(user.role)
}
