import type { Config as FormConfig } from 'final-form'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { Fragment, useState } from 'react'
import { useQueryClient } from 'react-query'

import type { StepCore, WorkflowCore, WorkflowDto } from '@/api/sshoc'
import {
  useGetLoggedInUser,
  useUpdateStep,
  useUpdateWorkflow,
} from '@/api/sshoc'
import type { ItemCategory, ItemSearchQuery } from '@/api/sshoc/types'
import { ActorsFormSection } from '@/components/item/ActorsFormSection/ActorsFormSection'
import { MainFormSection } from '@/components/item/MainFormSection/MainFormSection'
import { PropertiesFormSection } from '@/components/item/PropertiesFormSection/PropertiesFormSection'
import { RelatedItemsFormSection } from '@/components/item/RelatedItemsFormSection/RelatedItemsFormSection'
import { SourceFormSection } from '@/components/item/SourceFormSection/SourceFormSection'
import { WorkflowStepsFormSection } from '@/components/item/WorkflowStepsFormSection/WorkflowStepsFormSection'
import { Button } from '@/elements/Button/Button'
import { useToast } from '@/elements/Toast/useToast'
import { sanitizeFormValues } from '@/lib/sshoc/sanitizeFormValues'
import { validateCommonFormFields } from '@/lib/sshoc/validateCommonFormFields'
import { useAuth } from '@/modules/auth/AuthContext'
import { Form } from '@/modules/form/Form'
import { getSingularItemCategoryLabel } from '@/utils/getSingularItemCategoryLabel'

export interface ItemFormValues extends WorkflowCore {
  draft?: boolean
  composedOf?: Array<StepCore & { persistentId?: string; dirty?: boolean }>
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
  const stepLabel = getSingularItemCategoryLabel('step')

  const useItemMutation = useUpdateWorkflow

  const toast = useToast()
  const router = useRouter()
  const auth = useAuth()
  const user = useGetLoggedInUser()
  const isAllowedToPublish =
    user.data?.role !== undefined
      ? ['administrator', 'moderator'].includes(user.data.role)
      : false
  const queryClient = useQueryClient()
  const updateStep = useUpdateStep({
    onSuccess() {
      toast.success('Updated step')
    },
    onError() {
      toast.error('Failed to update step')
    },
  })
  const createWorkflow = useItemMutation({
    onSuccess(data: WorkflowDto) {
      toast.success(
        `Successfully ${
          isAllowedToPublish ? 'published' : 'submitted'
        } ${categoryLabel}.`,
      )

      queryClient.invalidateQueries({
        queryKey: ['itemSearch'],
      })
      queryClient.invalidateQueries({
        queryKey: ['getWorkflows'],
      })
      queryClient.invalidateQueries({
        queryKey: ['getWorkflow', { workflowId: data.persistentId }],
      })

      /**
       * if the item is published (i.e. submitted as admin), redirect to details page.
       */
      if (data.status === 'approved') {
        router.push({ pathname: `/${data.category}/${data.persistentId}` })
      } else {
        // TODO: redirect to separate page explaining that the submmited item is in moderation queue
        const query: ItemSearchQuery = {
          categories: [data.category!],
          order: ['label'],
        }
        router.push({ pathname: '/search', query })
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

  async function onSubmit({ draft, ...unsanitized }: ItemFormValues) {
    if (auth.session?.accessToken == null) {
      toast.error('Authentication required.')
      return Promise.reject()
    }

    const values = sanitizeFormValues(unsanitized)

    /**
     * Workflow steps need to be handled separately.
     */
    const { composedOf, ...workflow } = values

    if (composedOf !== undefined) {
      // await Promise.all(
      //   composedOf.map(({ dirty, ...rest }, index) => {
      //     const step = { ...rest, stepNo: index + 1 }

      //     /**
      //      * Backend crashes with `source: {}`.
      //      */
      //     if (step.source && step.source.id === undefined) {
      //       delete step.source
      //     }

      //     if (step.persistentId !== undefined) {
      //       /** Existing step was edited. */
      //       if (dirty) {
      //         console.log('Edit dirty step', step.persistentId, step.stepNo)
      //       } else {
      //         const original = props.item?.composedOf?.[index]
      //         /** Existing step was reorderd. */
      //         if (original.persistentId !== step.persistentId) {
      //           return updateStep.mutateAsync([
      //             { workflowId: id, stepId: step.persistentId },
      //             { draft },
      //             step,
      //             { token: auth.session?.accessToken },
      //           ])
      //         }
      //       }
      //     } else {
      //       /** Create new step. */
      //       console.log('Create step')
      //     }
      //   }),
      // )

      for (let index = 0; index < composedOf.length; index++) {
        const { dirty, ...rest } = composedOf[index]
        const step = { ...rest, stepNo: index + 1 }

        if (step.persistentId !== undefined) {
          /** Existing step was edited. */
          if (dirty === true) {
            console.log('Edit dirty step', step.persistentId, step.stepNo)
          } else {
            const original = props.item?.composedOf?.[index]
            /** Existing step was reorderd. */
            if (original.persistentId !== step.persistentId) {
              return updateStep.mutateAsync([
                { workflowId: id, stepId: step.persistentId },
                { draft },
                sanitizeFormValues(step),
                { token: auth.session.accessToken },
              ])
            }
          }
        } else {
          /** Create new step. */
          console.log('Create step')
        }
      }
    }

    return createWorkflow.mutateAsync([
      { workflowId: id },
      { draft },
      workflow,
      { token: auth.session.accessToken },
    ])
  }

  function onValidateWorkflow(values: Partial<ItemFormValues>) {
    const errors: Partial<Record<keyof typeof values, string>> = {}

    validateCommonFormFields(values, errors)

    return errors
  }

  function onCancel() {
    router.push('/')
  }

  /**
   *  Multi-page form.
   * */
  const [state, setState] = useState({ page: 0, values: initialValues })

  const pages = [
    <FormPage key="workflow-page" onValidate={onValidateWorkflow}>
      <MainFormSection />
      <ActorsFormSection initialValues={props.item} />
      <PropertiesFormSection initialValues={props.item} />
      <RelatedItemsFormSection initialValues={props.item} />
      <SourceFormSection />
    </FormPage>,
    <FormPage key="steps-page">
      <WorkflowStepsFormSection onPreviousPage={previousPage} />
    </FormPage>,
  ]

  const activePage = pages[state.page]
  const isLastPage = state.page === pages.length - 1
  const [pageStatus, setPageStatus] = useState(Array(pages.length).fill(true))

  function nextPage(values: Partial<ItemFormValues>) {
    setState((state) => ({
      values,
      page: Math.min(state.page + 1, pages.length - 1),
    }))
  }

  function previousPage() {
    setState((state) => ({
      values: state.values,
      page: Math.max(state.page - 1, 0),
    }))
  }

  function handleSubmit(values: Partial<ItemFormValues>) {
    if (isLastPage) {
      return onSubmit(values)
    } else {
      nextPage(values)
    }
  }

  function validate(values: Partial<ItemFormValues>) {
    return typeof activePage.props.onValidate === 'function'
      ? activePage.props.onValidate(values)
      : undefined
  }

  return (
    <Form
      onSubmit={handleSubmit}
      validate={validate}
      initialValues={state.values}
    >
      {({ handleSubmit, form, pristine, invalid, submitting }) => {
        return (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col space-y-12"
          >
            {pages[state.page]}
            <div className="flex items-center justify-end space-x-6">
              <Button onPress={onCancel} variant="link">
                Cancel
              </Button>
              {state.page > 0 ? (
                <Button onPress={previousPage}>Previous</Button>
              ) : null}
              {isLastPage ? (
                <Fragment>
                  <Button
                    type="submit"
                    onPress={() => {
                      form.change('draft', true)
                    }}
                    isDisabled={
                      pageStatus.some((pristine) => pristine === false) ||
                      invalid ||
                      submitting ||
                      createWorkflow.isLoading
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
                      pageStatus.some((pristine) => pristine === false) ||
                      invalid ||
                      submitting ||
                      createWorkflow.isLoading
                    }
                  >
                    {isAllowedToPublish ? 'Publish' : 'Submit'}
                  </Button>
                </Fragment>
              ) : (
                <Button
                  type="submit"
                  onPress={() => {
                    setPageStatus((status) => {
                      const newStatus = [...status]
                      newStatus[state.page] = pristine
                      return newStatus
                    })
                  }}
                  isDisabled={invalid}
                >
                  Next
                </Button>
              )}
            </div>
          </form>
        )
      }}
    </Form>
  )
}

interface FormPageProps {
  onValidate?: FormConfig<ItemFormValues>['validate']
  children: ReactNode
}

function FormPage(props: FormPageProps) {
  return <Fragment>{props.children}</Fragment>
}
