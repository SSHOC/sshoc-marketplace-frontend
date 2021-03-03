import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'

import type { WorkflowCore, WorkflowDto } from '@/api/sshoc'
import { useCreateWorkflow } from '@/api/sshoc'
import type { ItemCategory } from '@/api/sshoc/types'

import { ActorsFormSection } from '@/components/item/ActorsFormSection/ActorsFormSection'
import { MainFormSection } from '@/components/item/MainFormSection/MainFormSection'
import { PropertiesFormSection } from '@/components/item/PropertiesFormSection/PropertiesFormSection'
import { RelatedItemsFormSection } from '@/components/item/RelatedItemsFormSection/RelatedItemsFormSection'
import { SourceFormSection } from '@/components/item/SourceFormSection/SourceFormSection'
import { Button } from '@/elements/Button/Button'
import { useToast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import { Form } from '@/modules/form/Form'

export type ItemFormValues = WorkflowCore

export interface ItemFormProps<T> {
  category: ItemCategory
  initialValues?: Partial<T>
}

/**
 * Item edit form.
 */
export function ItemForm(props: ItemFormProps<ItemFormValues>): JSX.Element {
  const { category, initialValues } = props

  const useItemMutation = useCreateWorkflow

  const toast = useToast()
  const router = useRouter()
  const auth = useAuth()
  const queryClient = useQueryClient()
  const create = useItemMutation({
    onSuccess(data: WorkflowDto) {
      toast.success(`Successfully updated ${category}.`)

      queryClient.invalidateQueries({
        queryKey: ['itemSearch'],
      })
      queryClient.invalidateQueries({
        queryKey: ['getWorkflows'],
      })
      // queryClient.invalidateQueries({
      //   queryKey: ['getWorkflow', { id: data.persistentId }],
      // })

      router.push({ pathname: `/${data.category}/${data.persistentId}` })
    },
    onError() {
      toast.error(`Failed to update ${category}.`)
    },
  })

  function onSubmit(values: ItemFormValues) {
    if (auth.session?.accessToken == null) {
      toast.error('Authentication required.')
      return Promise.reject()
    }

    /**
     * Backend crashes with `source: {}`.
     */
    if (values.source && values.source.id === undefined) {
      delete values.source
    }

    return create.mutateAsync([{}, values, { token: auth.session.accessToken }])
  }

  function onValidate(values: Partial<ItemFormValues>) {
    const errors: Partial<Record<keyof typeof values, string>> = {}

    /** Required field `label`. */
    if (values.label === undefined) {
      errors.label = 'Label is required.'
    }

    /** Required field `description`. */
    if (values.description === undefined) {
      errors.description = 'Description is required.'
    }

    /** `sourceItemId` is required when `source` is set. */
    if (values.source?.id != null && values.sourceItemId == null) {
      errors.sourceItemId = 'Missing value in Source ID.'
    }

    /** `source` is required when `sourceItemId` is set. */
    if (values.sourceItemId != null && values.source?.id == null) {
      errors.sourceItemId = 'Missing value in Source.'
    }

    return errors
  }

  function onCancel() {
    router.push('/')
  }

  return (
    <Form
      onSubmit={onSubmit}
      validate={onValidate}
      initialValues={initialValues}
    >
      {({ handleSubmit, pristine, invalid, submitting }) => {
        return (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col space-y-12"
          >
            <MainFormSection />
            <ActorsFormSection />
            <PropertiesFormSection />
            <RelatedItemsFormSection />
            <SourceFormSection />
            <div className="flex items-center justify-end space-x-6">
              <Button onPress={onCancel} variant="link">
                Cancel
              </Button>
              <Button
                type="submit"
                isDisabled={
                  pristine || invalid || submitting || create.isLoading
                }
              >
                Submit
              </Button>
            </div>
          </form>
        )
      }}
    </Form>
  )
}
