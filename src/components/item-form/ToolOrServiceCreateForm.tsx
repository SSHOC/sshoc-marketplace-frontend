import type { FormApi, SubmissionErrors } from 'final-form'
import { FORM_ERROR } from 'final-form'
import { useRouter } from 'next/router'

import type { ItemFormValues } from '@/components/item-form/ItemForm'
import { ItemForm } from '@/components/item-form/ItemForm'
import { removeEmptyItemFieldsOnSubmit } from '@/components/item-form/removeEmptyItemFieldsOnSubmit'
import { useCreateItemMeta } from '@/components/item-form/useCreateItemMeta'
import { useCreateOrUpdateTool } from '@/components/item-form/useCreateOrUpdateTool'
import { useToolFormFields } from '@/components/item-form/useToolFormFields'
import { useToolFormRecommendedFields } from '@/components/item-form/useToolFormRecommendedFields'
import { useToolValidationSchema } from '@/components/item-form/useToolValidationSchema'
import type { ToolInput } from '@/data/sshoc/api/tool-or-service'
import { routes } from '@/lib/core/navigation/routes'

export type CreateToolFormValues = ItemFormValues<ToolInput>

export function ToolOrServiceCreateForm(): JSX.Element {
  const category = 'tool-or-service'

  const router = useRouter()
  const formFields = useToolFormFields()
  const recommendedFields = useToolFormRecommendedFields()
  const validate = useToolValidationSchema(removeEmptyItemFieldsOnSubmit)
  const meta = useCreateItemMeta({ category })
  const createOrUpdateTool = useCreateOrUpdateTool(undefined, { meta })

  function onSubmit(
    values: CreateToolFormValues,
    form: FormApi<CreateToolFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    const data = removeEmptyItemFieldsOnSubmit(values)
    delete values['__submitting__']

    createOrUpdateTool.mutate(
      { data, draft: shouldSaveAsDraft },
      {
        onSuccess(tool) {
          if (tool.status === 'draft') {
            // FIXME: Probably better to keep this state in useCreateOrUpdateTool.
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

  function onCancel() {
    router.push(routes.AccountPage())
  }

  return (
    <ItemForm<CreateToolFormValues>
      formFields={formFields}
      name="create-item"
      initialValues={recommendedFields}
      onCancel={onCancel}
      onSubmit={onSubmit}
      validate={validate}
    />
  )
}
