import type { FormApi, SubmissionErrors } from 'final-form'
import type { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/item-form/BackgroundImage'
import { Content } from '@/components/item-form/Content'
import type { ItemFormValues } from '@/components/item-form/ItemForm'
import { ItemFormScreenLayout } from '@/components/item-form/ItemFormScreenLayout'
import { useCreateOrUpdateWorkflow } from '@/components/item-form/useCreateOrUpdateWorkflow'
import { useReviewItemMeta } from '@/components/item-form/useReviewItemMeta'
import { useWorkflowFormFields } from '@/components/item-form/useWorkflowFormFields'
import { useWorkflowFormPage } from '@/components/item-form/useWorkflowFormPage'
import { useWorkflowWithStepsValidationSchema } from '@/components/item-form/useWorkflowValidationSchema'
import { WorkflowReviewForm } from '@/components/item-form/WorkflowReviewForm'
import type { Workflow, WorkflowInput } from '@/data/sshoc/api/workflow'
import {
  useRejectWorkflowVersion,
  useWorkflowDiff,
  useWorkflowVersion,
} from '@/data/sshoc/hooks/workflow'
import { isNotFoundError } from '@/data/sshoc/utils/isNotFoundError'
import type { PageComponent } from '@/lib/core/app/types'
import { FORM_ERROR } from '@/lib/core/form/Form'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { getLocales } from '@/lib/core/i18n/getLocales'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import type { QueryMetadata } from '@/lib/core/query/types'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'

export type UpdateWorkflowFormValues = ItemFormValues<WorkflowInput>

export namespace ReviewWorkflowPage {
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

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<ReviewWorkflowPage.PathParams>
> {
  const locales = getLocales()
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
  context: GetStaticPropsContext<ReviewWorkflowPage.PathParams>,
): Promise<GetStaticPropsResult<ReviewWorkflowPage.Props>> {
  const locale = getLocale()
  const params = context.params as ReviewWorkflowPage.PathParams
  const messages = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      messages,
      params,
    },
  }
}

export default function ReviewWorkflowPage(props: ReviewWorkflowPage.Props): JSX.Element {
  const t = useTranslations()
  const router = useRouter()

  const { persistentId, versionId: _versionId } = props.params
  const versionId = Number(_versionId)
  const _workflow = useWorkflowVersion({ persistentId, versionId }, undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  const workflow = _workflow.data
  /** For newly suggested items there will be no diff available. */
  const ignoreMissingDiff: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false
        return undefined
      },
    },
  }
  const _diff = useWorkflowDiff(
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

  const { page, setPage } = useWorkflowFormPage()

  const category = workflow?.category ?? 'workflow'
  const label = t(`common.item-categories.${category}.one`)
  const title = t('authenticated.forms.edit-item', {
    item:
      page.type === 'workflow'
        ? label
        : page.type === 'steps'
          ? t('common.item-categories.step.other')
          : t('common.item-categories.step.one'),
  })

  const formFields = useWorkflowFormFields()
  const validate = useWorkflowWithStepsValidationSchema()
  const meta = useReviewItemMeta({ category })
  const createOrUpdateWorkflow = useCreateOrUpdateWorkflow(undefined, { meta: meta.approve })
  const rejectWorkflowVersion = useRejectWorkflowVersion({ persistentId, versionId }, undefined, {
    meta: meta.reject,
  })

  function onSubmit(
    values: UpdateWorkflowFormValues,
    form: FormApi<UpdateWorkflowFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    delete values['__submitting__']

    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    createOrUpdateWorkflow.mutate(
      { data: values, draft: shouldSaveAsDraft },
      {
        onSuccess(workflow) {
          if (workflow.status === 'draft') {
            // FIXME: Probably better to keep this state in useCreateOrUpdateWorkflow.
            form.batch(() => {
              form.change('persistentId', workflow.persistentId)
              form.change('status', workflow.status)
            })
            window.scrollTo(0, 0)
          } else if (workflow.status === 'approved') {
            router.push(`/workflow/${workflow.persistentId}`)
          } else {
            router.push(`/success`)
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
    rejectWorkflowVersion.mutate()
  }

  function onCancel() {
    router.push(`/account`)
  }

  if (router.isFallback || workflow == null || (diff == null && !diffNotFound)) {
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
            <WorkflowReviewForm<UpdateWorkflowFormValues>
              formFields={formFields}
              name="review-item"
              initialValues={workflow}
              diff={diff}
              onCancel={onCancel}
              onReject={onReject}
              onSubmit={onSubmit}
              validate={validate}
              page={page}
              setPage={setPage}
            />
          </Content>
          <FundingNotice />
        </ItemFormScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<ReviewWorkflowPage.Props> = ReviewWorkflowPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator'].includes(user.role)
}
