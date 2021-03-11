import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'

import type { DatasetCore, DatasetDto } from '@/api/sshoc'
import { useGetLoggedInUser, useUpdateDataset } from '@/api/sshoc'
import type { ItemCategory } from '@/api/sshoc/types'
import { ActorsFormSection } from '@/components/item/ActorsFormSection/ActorsFormSection'
import { DateFormSection } from '@/components/item/DateFormSection/DateFormSection'
import { MainFormSection } from '@/components/item/MainFormSection/MainFormSection'
import { PropertiesFormSection } from '@/components/item/PropertiesFormSection/PropertiesFormSection'
import { RelatedItemsFormSection } from '@/components/item/RelatedItemsFormSection/RelatedItemsFormSection'
import { SourceFormSection } from '@/components/item/SourceFormSection/SourceFormSection'
import { Button } from '@/elements/Button/Button'
import { useToast } from '@/elements/Toast/useToast'
import { sanitizeFormValues } from '@/lib/sshoc/sanitizeFormValues'
import { validateCommonFormFields } from '@/lib/sshoc/validateCommonFormFields'
import { validateDateFormFields } from '@/lib/sshoc/validateDateFormFields'
import { useAuth } from '@/modules/auth/AuthContext'
import { Form } from '@/modules/form/Form'
import { getSingularItemCategoryLabel } from '@/utils/getSingularItemCategoryLabel'

export interface ItemFormValues extends DatasetCore {
  draft?: boolean
}

export interface ItemFormProps<T> {
  id: string
  category: ItemCategory
  initialValues?: Partial<T>
  item?: any
}

/**
 * Item edit form.
 */
export function ItemForm(props: ItemFormProps<ItemFormValues>): JSX.Element {
  const { id, category, initialValues } = props

  const categoryLabel = getSingularItemCategoryLabel(category)

  const useItemMutation = useUpdateDataset

  const toast = useToast()
  const router = useRouter()
  const auth = useAuth()
  const user = useGetLoggedInUser()
  const isAllowedToPublish =
    user.data?.role !== undefined
      ? ['administrator', 'moderator'].includes(user.data.role)
      : false
  const queryClient = useQueryClient()
  const create = useItemMutation({
    onSuccess(data: DatasetDto) {
      toast.success(
        `Successfully ${
          isAllowedToPublish ? 'published' : 'submitted'
        } ${categoryLabel}.`,
      )

      queryClient.invalidateQueries({
        queryKey: ['itemSearch'],
      })
      queryClient.invalidateQueries({
        queryKey: ['getDatasets'],
      })
      queryClient.invalidateQueries({
        queryKey: ['getDataset', { id: data.persistentId }],
      })

      /**
       * if the item is published (i.e. submitted as admin), redirect to details page.
       */
      if (data.status === 'approved') {
        router.push({ pathname: `/${data.category}/${data.persistentId}` })
      } else {
        router.push({ pathname: '/success' })
      }
    },
    onError() {
      toast.error(
        `Failed to ${
          isAllowedToPublish ? 'publish' : 'submit'
        } ${categoryLabel}.`,
      )
    },
  })

  function onSubmit({ draft, ...unsanitized }: ItemFormValues) {
    if (auth.session?.accessToken == null) {
      toast.error('Authentication required.')
      return Promise.reject()
    }

    const values = sanitizeFormValues(unsanitized)

    return create.mutateAsync([
      { id },
      { draft },
      values,
      { token: auth.session.accessToken },
    ])
  }

  function onValidate(values: Partial<ItemFormValues>) {
    const errors: Partial<Record<keyof typeof values, string>> = {}

    validateCommonFormFields(values, errors)
    validateDateFormFields(values, errors)

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
      {({ handleSubmit, form, pristine, invalid, submitting }) => {
        return (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col space-y-12"
          >
            <MainFormSection />
            <DateFormSection />
            <ActorsFormSection initialValues={props.item} />
            <PropertiesFormSection initialValues={props.item} />
            <RelatedItemsFormSection initialValues={props.item} />
            <SourceFormSection />
            <div className="flex items-center justify-end space-x-6">
              <Button onPress={onCancel} variant="link">
                Cancel
              </Button>
              <Button
                type="submit"
                onPress={() => {
                  form.change('draft', true)
                }}
                isDisabled={
                  pristine || invalid || submitting || create.isLoading
                }
                variant="link"
              >
                Save as draft
              </Button>
              <Button
                type="submit"
                onPress={() => {
                  form.change('draft', undefined)
                }}
                isDisabled={
                  pristine || invalid || submitting || create.isLoading
                }
              >
                {isAllowedToPublish ? 'Publish' : 'Submit'}
              </Button>
            </div>
          </form>
        )
      }}
    </Form>
  )
}
