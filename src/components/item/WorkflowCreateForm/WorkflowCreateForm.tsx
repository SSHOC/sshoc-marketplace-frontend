import type { Config as FormConfig } from 'final-form'
import get from 'lodash.get'
import set from 'lodash.set'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { Fragment, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import type { StepCore, WorkflowCore, WorkflowDto } from '@/api/sshoc'
import {
  useCreateStep,
  useCreateWorkflow,
  useGetLoggedInUser,
} from '@/api/sshoc'
import type { ItemCategory } from '@/api/sshoc/types'
import { ActorsFormSection } from '@/components/item/ActorsFormSection/ActorsFormSection'
import { MainFormSection } from '@/components/item/MainFormSection/MainFormSection'
import { PropertiesFormSection } from '@/components/item/PropertiesFormSection/PropertiesFormSection'
import { RelatedItemsFormSection } from '@/components/item/RelatedItemsFormSection/RelatedItemsFormSection'
import { SourceFormSection } from '@/components/item/SourceFormSection/SourceFormSection'
import { WorkflowStepsFormSection } from '@/components/item/WorkflowStepsFormSection/WorkflowStepsFormSection'
import { Button } from '@/elements/Button/Button'
import { useToast } from '@/elements/Toast/useToast'
import { sanitizeFormValues } from '@/lib/sshoc/sanitizeFormValues'
import { useValidateCommonFormFields } from '@/lib/sshoc/validateCommonFormFields'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import { Form } from '@/modules/form/Form'
import { getSingularItemCategoryLabel } from '@/utils/getSingularItemCategoryLabel'

export type PageKey = 'workflow' | 'steps' | 'step'

export interface ItemFormValues extends WorkflowCore {
  draft?: boolean
  composedOf?: Array<StepCore & { persistentId?: string }>
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
  const stepLabel = getSingularItemCategoryLabel('step')

  const useItemMutation = useCreateWorkflow

  const toast = useToast()
  const router = useRouter()
  const auth = useAuth()
  const user = useGetLoggedInUser()
  const handleErrors = useErrorHandlers()
  const validateCommonFormFields = useValidateCommonFormFields()
  const isAllowedToPublish =
    user.data?.role !== undefined
      ? ['administrator', 'moderator'].includes(user.data.role)
      : false
  const queryClient = useQueryClient()
  const createStep = useCreateStep({
    onError(error) {
      toast.error(
        `Failed to ${isAllowedToPublish ? 'publish' : 'submit'} ${stepLabel}.`,
      )

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
  })
  const createWorkflow = useItemMutation({
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

  /**
   * We cannot invalidate cache and redirect in a useMutation onSuccess callback,
   * since the whole operation is not atomic, but consists of multiple requests.
   */
  function onSuccess(data: WorkflowDto) {
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
    // queryClient.invalidateQueries({
    //   queryKey: ['getWorkflow', { workflowId: data.persistentId }],
    // })

    /**
     * if the item is published (i.e. submitted as admin), redirect to details page.
     */
    if (data.status === 'approved') {
      router.push({ pathname: `/${data.category}/${data.persistentId}` })
    } else {
      router.push({ pathname: '/success' })
    }
  }

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

    const createdWorkflow = await createWorkflow.mutateAsync([
      { draft },
      workflow,
      { token: auth.session.accessToken },
    ])

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const workflowId = createdWorkflow.persistentId!

    /**
     * We cannot dispatch all at once with Promise,all because this crashes the backend.
     * create/update step operations must be run sequentially.
     *
     * Also, no need to supply `stepNo` since every steps is newly created.
     * Also, no need to check for `dirty` flag.
     */
    await (composedOf ?? []).reduce((operations, step) => {
      return operations.then(() => {
        return createStep.mutateAsync([
          { workflowId },
          { draft },
          sanitizeFormValues(step),
          { token: auth.session?.accessToken },
        ])
      })
    }, Promise.resolve() as any)

    /** This will only get called when the above didn't throw. */
    onSuccess(createdWorkflow)
  }

  const [state, setState] = useState<{
    page: PageKey
    prefix?: string
    onReset?: () => void
    values?: Partial<ItemFormValues>
  }>({ page: 'workflow', prefix: '', values: initialValues })

  function onValidateWorkflow(values: Partial<ItemFormValues>) {
    const errors: Partial<Record<keyof typeof values, string>> = {}

    validateCommonFormFields(values, errors)

    return errors
  }
  function onValidateWorkflowStep(values: Partial<ItemFormValues>) {
    const errors: Partial<Record<keyof typeof values, string>> = {}

    const prefix = state.prefix?.slice(0, -1)
    if (prefix == null || prefix.length === 0) return errors

    const step = get(values, prefix)
    if (step == null) return errors
    validateCommonFormFields(step, errors)

    return set({}, prefix, errors)
  }

  const pages: Record<
    PageKey,
    {
      Page: FC<FormPageProps>
      onValidate?: FormConfig<ItemFormValues>['validate']
    }
  > = {
    workflow: {
      Page: WorkflowPage,
      onValidate: onValidateWorkflow,
    },
    steps: {
      Page: WorkflowStepsPage,
    },
    step: {
      Page: WorkflowStepPage,
      onValidate: onValidateWorkflowStep,
    },
  }

  // const pageKeys = Object.keys(pages)
  // const pageCount = pageKeys.length
  const currentPageKey = state.page
  const currentPage = pages[currentPageKey]
  const { Page, onValidate } = currentPage

  useEffect(() => {
    window.scroll(0, 0)
  }, [currentPageKey])

  function onNextPage(values: Partial<ItemFormValues>) {
    setState((state) => ({
      ...state,
      values,
      page:
        state.page === 'workflow'
          ? 'steps'
          : state.page === 'step'
          ? 'steps'
          : state.page,
    }))
  }

  function onPreviousPage() {
    setState((state) => ({
      ...state,
      page:
        state.page === 'steps'
          ? 'workflow'
          : state.page === 'step'
          ? 'steps'
          : state.page,
    }))
  }

  function onSetPage(page: PageKey, prefix = '', onReset?: () => void) {
    setState((state) => ({
      ...state,
      page,
      prefix,
      onReset,
    }))
  }

  function onCancel() {
    if (currentPageKey === 'step') {
      state.onReset?.()
      onSetPage('steps', '', undefined)
    } else {
      router.push('/')
    }
  }

  function handleSubmit(values: Partial<ItemFormValues>) {
    if (state.page === 'steps') {
      return onSubmit(values)
    } else {
      onNextPage(values)
    }
  }

  function validate(values: Partial<ItemFormValues>) {
    return typeof onValidate === 'function' ? onValidate(values) : undefined
  }

  /**
   * Keep track if pristine state for all pages, because final-form will
   * (i) calculate `pristine` only for the currently registered (i.e. rendered)
   * fields, and (ii) recalculate when going back to a previously visited page
   * by comparing to the current initialValues.
   */
  const [pageStatus, setPageStatus] = useState<Record<PageKey, boolean>>({
    workflow: true,
    steps: true,
    step: true,
  })

  function updatePageStatus(pristine: boolean) {
    setPageStatus((status) => {
      return {
        ...status,
        [state.page]: status[state.page] && pristine,
      }
    })
  }

  function isFormPristine(isCurrentPagePristine: boolean) {
    return (
      isCurrentPagePristine &&
      Object.values(pageStatus).every((pristine) => pristine === true)
    )
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
            <Page onSetPage={onSetPage} prefix={state.prefix} />
            <div className="flex items-center justify-end space-x-6">
              <Button onPress={onCancel} variant="link">
                Cancel
              </Button>
              {currentPageKey === 'steps' ? (
                <Button
                  onPress={() => {
                    updatePageStatus(pristine)
                    onPreviousPage()
                  }}
                >
                  Previous
                </Button>
              ) : null}
              {currentPageKey === 'steps' ? (
                <Fragment>
                  <Button
                    type="submit"
                    onPress={() => {
                      form.change('draft', true)
                    }}
                    isDisabled={
                      isFormPristine(pristine) ||
                      invalid ||
                      submitting ||
                      createWorkflow.isLoading ||
                      createStep.isLoading
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
                      isFormPristine(pristine) ||
                      invalid ||
                      submitting ||
                      createWorkflow.isLoading ||
                      createStep.isLoading
                    }
                  >
                    {isAllowedToPublish ? 'Publish' : 'Submit'}
                  </Button>
                </Fragment>
              ) : (
                <Button
                  type="submit"
                  onPress={() => {
                    /** note: no need to mark step as dirty */

                    updatePageStatus(pristine)
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
  onSetPage: (page: PageKey, prefix?: string, onReset?: () => void) => void
  prefix?: string
}

function WorkflowPage() {
  return (
    <Fragment>
      <MainFormSection />
      <ActorsFormSection />
      <PropertiesFormSection />
      <RelatedItemsFormSection />
      <SourceFormSection />
    </Fragment>
  )
}

function WorkflowStepsPage(props: FormPageProps) {
  return (
    <Fragment>
      <WorkflowStepsFormSection onSetPage={props.onSetPage} />
    </Fragment>
  )
}

function WorkflowStepPage(props: FormPageProps) {
  const prefix = props.prefix ?? ''

  return (
    <Fragment>
      <MainFormSection prefix={prefix} />
      <ActorsFormSection prefix={prefix} />
      <PropertiesFormSection prefix={prefix} />
      <RelatedItemsFormSection prefix={prefix} />
      <SourceFormSection prefix={prefix} />
    </Fragment>
  )
}
