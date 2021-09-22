import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQueryClient } from 'react-query'

import type { TrainingMaterialCore, TrainingMaterialDto } from '@/api/sshoc'
import {
  useCreateTrainingMaterial,
  useUpdateTrainingMaterial,
} from '@/api/sshoc'
import { useCurrentUser } from '@/api/sshoc/client'
import type { ItemCategory } from '@/api/sshoc/types'
import { ActorsFormSection } from '@/components/item/ActorsFormSection/ActorsFormSection'
import { MainFormSection } from '@/components/item/MainFormSection/MainFormSection'
import { MediaFormSection } from '@/components/item/MediaFormSection/MediaFormSection'
import { PropertiesFormSection } from '@/components/item/PropertiesFormSection/PropertiesFormSection'
import { RelatedItemsFormSection } from '@/components/item/RelatedItemsFormSection/RelatedItemsFormSection'
import { ThumbnailFormSection } from '@/components/item/ThumbnailFormSection/ThumbnailFormSection'
import { Button } from '@/elements/Button/Button'
import { useToast } from '@/elements/Toast/useToast'
import { sanitizeFormValues } from '@/lib/sshoc/sanitizeFormValues'
import { useValidateCommonFormFields } from '@/lib/sshoc/validateCommonFormFields'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import { Form } from '@/modules/form/Form'
import { getSingularItemCategoryLabel } from '@/utils/getSingularItemCategoryLabel'

export interface ItemFormValues extends TrainingMaterialCore {
  draft?: boolean
}

export interface ItemFormProps<T> {
  category: ItemCategory
  initialValues?: Partial<T>
}

/**
 * Item edit form.
 */
export function ItemForm(props: ItemFormProps<ItemFormValues>): JSX.Element {
  const { category, initialValues } = props

  const categoryLabel = getSingularItemCategoryLabel(category)

  /**
   * When a user saves a first draft, we dispatch a POST request,
   * which will return a persistent id, which we need to use in
   * subsequent PUT requests, to avoid creating multiple items.
   */
  const [persistentIdFromSavedDraft, setPersistentIdFromSavedDraft] = useState<
    string | undefined
  >(undefined)
  const useItemMutation =
    persistentIdFromSavedDraft != null
      ? useUpdateTrainingMaterial
      : useCreateTrainingMaterial

  const toast = useToast()
  const router = useRouter()
  const auth = useAuth()
  const user = useCurrentUser()
  const handleErrors = useErrorHandlers()
  const validateCommonFormFields = useValidateCommonFormFields()
  const isAllowedToPublish =
    user.data?.role !== undefined
      ? ['administrator', 'moderator'].includes(user.data.role)
      : false
  const queryClient = useQueryClient()
  const create = useItemMutation({
    onSuccess(data: TrainingMaterialDto) {
      toast.success(
        `Successfully ${
          data.status === 'draft'
            ? 'saved as draft'
            : isAllowedToPublish
            ? 'published'
            : 'submitted'
        } ${categoryLabel}.`,
      )

      queryClient.invalidateQueries({
        queryKey: ['searchItems'],
      })
      queryClient.invalidateQueries({
        queryKey: ['getTrainingMaterials'],
      })
      // queryClient.invalidateQueries({
      //   queryKey: ['getTrainingMaterial', { persistentId: data.persistentId }],
      // })
      if (data.status === 'draft') {
        queryClient.invalidateQueries({
          queryKey: ['getMyDraftItems'],
        })

        setPersistentIdFromSavedDraft(data.persistentId)
      }

      /**
       * if the item is published (i.e. submitted as admin), redirect to details page.
       */
      if (data.status === 'approved') {
        router.push({ pathname: `/${data.category}/${data.persistentId}` })
      } else if (data.status === 'draft') {
        /** Stay on page and don't clear form when saving as draft. */
        // router.push({ pathname: '/' })
        window.scroll(0, 0)
      } else {
        router.push({ pathname: '/success' })
      }
    },
    onError(error) {
      toast.error(
        `Failed to ${
          isAllowedToPublish ? 'publish' : 'submit'
        } ${categoryLabel}.`,
      )

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
  })

  async function onSubmit({ draft, ...unsanitized }: ItemFormValues) {
    if (auth.session?.accessToken == null) {
      toast.error('Authentication required.')
      return Promise.reject()
    }

    const values = sanitizeFormValues(unsanitized)

    if (persistentIdFromSavedDraft == null) {
      const mutateAsync = create.mutateAsync as ReturnType<
        typeof useCreateTrainingMaterial
      >['mutateAsync']

      await mutateAsync([
        { draft },
        values,
        { token: auth.session.accessToken },
      ])
    } else {
      const mutateAsync = create.mutateAsync as ReturnType<
        typeof useUpdateTrainingMaterial
      >['mutateAsync']

      await mutateAsync([
        { persistentId: persistentIdFromSavedDraft },
        { draft },
        values,
        { token: auth.session.accessToken },
      ])
    }

    /**
     * If `onSubmit` resolves to `undefined` it's a successful submit.
     * If the promise resolves to something else the submit has failed.
     * If the promise rejects it's a network error (or similar).
     */
    return Promise.resolve()
  }

  function onValidate(values: Partial<ItemFormValues>) {
    const errors: Partial<Record<keyof typeof values, string>> = {}

    validateCommonFormFields(values, errors)

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
            <ActorsFormSection />
            <PropertiesFormSection />
            <MediaFormSection />
            <ThumbnailFormSection />
            <RelatedItemsFormSection />
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
