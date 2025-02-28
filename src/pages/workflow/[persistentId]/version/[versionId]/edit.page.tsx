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
import { useCreateOrUpdateWorkflow } from '@/components/item-form/useCreateOrUpdateWorkflow'
import { useUpdateItemMeta } from '@/components/item-form/useUpdateItemMeta'
import { useWorkflowFormFields } from '@/components/item-form/useWorkflowFormFields'
import { useWorkflowFormPage } from '@/components/item-form/useWorkflowFormPage'
import { useWorkflowWithStepsValidationSchema } from '@/components/item-form/useWorkflowValidationSchema'
import { WorkflowForm } from '@/components/item-form/WorkflowForm'
import type { Workflow, WorkflowInput } from '@/data/sshoc/api/workflow'
import { useWorkflow, useWorkflowVersion } from '@/data/sshoc/hooks/workflow'
import type { PageComponent } from '@/lib/core/app/types'
import { FORM_ERROR } from '@/lib/core/form/Form'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { getLocales } from '@/lib/core/i18n/getLocales'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { useSearchParams } from '@/lib/core/navigation/useSearchParams'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'

export type UpdateWorkflowFormValues = ItemFormValues<WorkflowInput>

export namespace EditWorkflowVersionPage {
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
): Promise<GetStaticPathsResult<EditWorkflowVersionPage.PathParams>> {
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
  context: GetStaticPropsContext<EditWorkflowVersionPage.PathParams>,
): Promise<GetStaticPropsResult<EditWorkflowVersionPage.Props>> {
  const locale = getLocale(context)
  const params = context.params as EditWorkflowVersionPage.PathParams
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
      params,
    },
  }
}

export default function EditWorkflowVersionPage(props: EditWorkflowVersionPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()
  const router = useRouter()

  const { persistentId, versionId: _versionId } = props.params
  const versionId = Number(_versionId)
  const searchParams = useSearchParams()
  const isDraftVersion = searchParams != null && searchParams.get('draft') != null
  const _dataset = !isDraftVersion
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useWorkflowVersion({ persistentId, versionId }, undefined, {
        enabled: router.isReady,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useWorkflow({ persistentId, draft: true }, undefined, {
        enabled: router.isReady,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      })
  const workflow = _dataset.data

  const { page, setPage } = useWorkflowFormPage()

  const category = workflow?.category ?? 'workflow'
  const label = t(['common', 'item-categories', category, 'one'])
  const title = t(['authenticated', 'forms', 'edit-item'], {
    values: {
      item:
        page.type === 'workflow'
          ? label
          : page.type === 'steps'
            ? t(['common', 'item-categories', 'step', 'other'])
            : t(['common', 'item-categories', 'step', 'one']),
    },
  })

  const formFields = useWorkflowFormFields()
  const validate = useWorkflowWithStepsValidationSchema()
  const meta = useUpdateItemMeta({ category })
  const createOrUpdateWorkflow = useCreateOrUpdateWorkflow(undefined, { meta })

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
            router.push(routes.WorkflowPage({ persistentId: workflow.persistentId }))
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

  function onCancel() {
    router.push(routes.AccountPage())
  }

  if (router.isFallback || workflow == null) {
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
            <WorkflowForm<UpdateWorkflowFormValues>
              formFields={formFields}
              name="update-item-version"
              initialValues={workflow}
              onCancel={onCancel}
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

const Page: PageComponent<EditWorkflowVersionPage.Props> = EditWorkflowVersionPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
