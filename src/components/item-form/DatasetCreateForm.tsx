import type { FormApi, SubmissionErrors } from 'final-form'
import { FORM_ERROR } from 'final-form'
import { useRouter } from 'next/router'

import type { ItemFormValues } from '@/components/item-form/ItemForm'
import { ItemForm } from '@/components/item-form/ItemForm'
import { removeEmptyItemFieldsOnSubmit } from '@/components/item-form/removeEmptyItemFieldsOnSubmit'
import { useCreateItemMeta } from '@/components/item-form/useCreateItemMeta'
import { useCreateOrUpdateDataset } from '@/components/item-form/useCreateOrUpdateDataset'
import { useDatasetFormFields } from '@/components/item-form/useDatasetFormFields'
import { useDatasetFormRecommendedFields } from '@/components/item-form/useDatasetFormRecommendedFields'
import { useDatasetValidationSchema } from '@/components/item-form/useDatasetValidationSchema'
import type { DatasetInput } from '@/data/sshoc/api/dataset'
import { getApiErrorMessage } from '@/data/sshoc/utils/get-api-error-message'

export type CreateDatasetFormValues = ItemFormValues<DatasetInput>

export function DatasetCreateForm(): JSX.Element {
  const category = 'dataset'

  const router = useRouter()
  const formFields = useDatasetFormFields()
  const recommendedFields = useDatasetFormRecommendedFields()
  const validate = useDatasetValidationSchema(removeEmptyItemFieldsOnSubmit)
  const meta = useCreateItemMeta({ category })
  const createOrUpdateDataset = useCreateOrUpdateDataset(undefined, { meta })

  function onSubmit(
    values: CreateDatasetFormValues,
    form: FormApi<CreateDatasetFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    const data = removeEmptyItemFieldsOnSubmit(values)
    delete values['__submitting__']

    form.pauseValidation()
    createOrUpdateDataset.mutate(
      { data, draft: shouldSaveAsDraft },
      {
        onSuccess(dataset) {
          if (dataset.status === 'draft') {
            form.batch(() => {
              form.change('persistentId', dataset.persistentId)
              form.change('status', dataset.status)
            })
            window.scrollTo(0, 0)
            form.resumeValidation()
          } else if (dataset.status === 'approved') {
            router.push(routes.DatasetPage({ persistentId: dataset.persistentId }))
          } else {
            router.push(`/success`)
          }
          done?.()
        },
        onError(error) {
          form.resumeValidation()
          getApiErrorMessage(error).then((message) => {
            done?.({ [FORM_ERROR]: message })
          })
        },
      },
    )
  }

  function onCancel() {
    router.push(`/account`)
  }

  return (
    <ItemForm<CreateDatasetFormValues>
      formFields={formFields}
      name="create-item"
      initialValues={recommendedFields}
      onCancel={onCancel}
      onSubmit={onSubmit}
      validate={validate}
    />
  )
}
