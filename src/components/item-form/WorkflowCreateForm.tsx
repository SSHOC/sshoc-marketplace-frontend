import type { FormApi, SubmissionErrors } from 'final-form'
import { FORM_ERROR } from 'final-form'
import { useRouter } from 'next/router'

import type { ItemFormValues } from '@/components/item-form/ItemForm'
import { removeEmptyItemFieldsOnSubmit } from '@/components/item-form/removeEmptyItemFieldsOnSubmit'
import { useCreateItemMeta } from '@/components/item-form/useCreateItemMeta'
import { useCreateOrUpdateWorkflow } from '@/components/item-form/useCreateOrUpdateWorkflow'
import { useWorkflowFormFields } from '@/components/item-form/useWorkflowFormFields'
import type { WorkflowFormPage } from '@/components/item-form/useWorkflowFormPage'
import { useWorkflowFormRecommendedFields } from '@/components/item-form/useWorkflowFormRecommendedFields'
import { useWorkflowValidationSchema } from '@/components/item-form/useWorkflowValidationSchema'
import { WorkflowForm } from '@/components/item-form/WorkflowForm'
import type { WorkflowInput } from '@/data/sshoc/api/workflow'
import type { WorkflowStepInput } from '@/data/sshoc/api/workflow-step'
import { routes } from '@/lib/core/navigation/routes'

export type CreateWorkflowFormValues = ItemFormValues<
  WorkflowInput & { composedOf?: Array<ItemFormValues<WorkflowStepInput>> }
>

export interface WorkflowCreateFormProps {
  page: WorkflowFormPage
  setPage: (page: WorkflowFormPage) => void
}

export function WorkflowCreateForm(props: WorkflowCreateFormProps): JSX.Element {
  const { page, setPage } = props

  const category = 'workflow'

  const router = useRouter()
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
  )
}
