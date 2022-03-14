import type { StringParams } from '@stefanprobst/next-route-manifest'
import type { FormApi, SubmissionErrors } from 'final-form'
import { FORM_ERROR } from 'final-form'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/item-form/BackgroundImage'
import { Content } from '@/components/item-form/Content'
import type { ItemFormValues } from '@/components/item-form/ItemForm'
import { ItemFormScreenLayout } from '@/components/item-form/ItemFormScreenLayout'
import { removeEmptyItemFieldsOnSubmit } from '@/components/item-form/removeEmptyItemFieldsOnSubmit'
import { useCreateItemMeta } from '@/components/item-form/useCreateItemMeta'
import { useCreateOrUpdateWorkflow } from '@/components/item-form/useCreateOrUpdateWorkflow'
import { useWorkflowFormFields } from '@/components/item-form/useWorkflowFormFields'
import { useWorkflowFormPage } from '@/components/item-form/useWorkflowFormPage'
import { useWorkflowFormRecommendedFields } from '@/components/item-form/useWorkflowFormRecommendedFields'
import { useWorkflowValidationSchema } from '@/components/item-form/useWorkflowValidationSchema'
import { WorkflowForm } from '@/components/item-form/WorkflowForm'
import type { WorkflowInput } from '@/data/sshoc/api/workflow'
import type { WorkflowStepInput } from '@/data/sshoc/api/workflow-step'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { PageMainContent } from '@/lib/core/page/PageMainContent'

export type CreateWorkflowFormValues = ItemFormValues<
  WorkflowInput & { composedOf?: Array<ItemFormValues<WorkflowStepInput>> }
>

export namespace CreateWorkflowPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export type Props = WithDictionaries<'authenticated' | 'common'>
}

export async function getStaticProps(
  context: GetStaticPropsContext<CreateWorkflowPage.PathParams>,
): Promise<GetStaticPropsResult<CreateWorkflowPage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
    },
  }
}

export default function CreateWorkflowPage(_props: CreateWorkflowPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()
  const router = useRouter()

  const { page, setPage } = useWorkflowFormPage()

  const category = 'workflow'
  const label = t(['common', 'item-categories', category, 'one'])
  const title = t(['authenticated', 'forms', 'create-item'], {
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
  const recommendedFields = useWorkflowFormRecommendedFields()
  const validate = useWorkflowValidationSchema(removeEmptyItemFieldsOnSubmit)
  const meta = useCreateItemMeta({ category })
  const createOrUpdateWorkflow = useCreateOrUpdateWorkflow(undefined, { meta })

  function onSubmit(
    values: CreateWorkflowFormValues,
    form: FormApi<CreateWorkflowFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    const data = removeEmptyItemFieldsOnSubmit(values)
    delete values['__submitting__']

    createOrUpdateWorkflow.mutate(
      { data, draft: shouldSaveAsDraft },
      {
        onSuccess(workflow) {
          if (workflow.status === 'draft') {
            // FIXME: Probably better to keep this state in useCreateOrUpdateWorkflow.
            form.batch(() => {
              form.change('persistentId', workflow.persistentId)
              form.change('status', workflow.status)
              workflow.composedOf.forEach((step, index) => {
                form.change(`composedOf[${index}].persistentId`, step.persistentId)
                form.change(`composedOf[${index}].status`, step.status)
              })
              window.scrollTo(0, 0)
            })
          } else if (workflow.status === 'approved') {
            router.push(routes.WorkflowPage({ persistentId: workflow.persistentId }))
          } else {
            router.push(routes.SuccessPage())
          }
          done?.()
        },
        onError(error) {
          done?.({ [FORM_ERROR]: error })
        },
      },
    )
  }

  function onCancel() {
    router.push(routes.AccountPage())
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
            <WorkflowForm<CreateWorkflowFormValues>
              formFields={formFields}
              initialValues={recommendedFields}
              name="create-workflow"
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

const Page: PageComponent<CreateWorkflowPage.Props> = CreateWorkflowPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
