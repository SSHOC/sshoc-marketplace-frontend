import { useButton } from '@react-aria/button'
import type { AriaButtonProps } from '@react-types/button'
import cx from 'clsx'
import type { Config as FormConfig } from 'final-form'
import get from 'lodash.get'
import set from 'lodash.set'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useQueryClient } from 'react-query'

import type { StepCore, WorkflowCore, WorkflowDto } from '@/api/sshoc'
import { useCreateStep, useUpdateStep, useUpdateWorkflow } from '@/api/sshoc'
import { useCurrentUser } from '@/api/sshoc/client'
import type { ItemCategory } from '@/api/sshoc/types'
import { ActorsFormSection } from '@/components/item/ActorsFormSection/ActorsFormSection'
import { MainFormSection } from '@/components/item/MainFormSection/MainFormSection'
import { MediaFormSection } from '@/components/item/MediaFormSection/MediaFormSection'
import { PropertiesFormSection } from '@/components/item/PropertiesFormSection/PropertiesFormSection'
import { RelatedItemsFormSection } from '@/components/item/RelatedItemsFormSection/RelatedItemsFormSection'
import { ThumbnailFormSection } from '@/components/item/ThumbnailFormSection/ThumbnailFormSection'
import { WorkflowStepsFormSection } from '@/components/item/WorkflowStepsFormSection/WorkflowStepsFormSection'
import { Button } from '@/elements/Button/Button'
import { useToast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { sanitizeFormValues } from '@/lib/sshoc/sanitizeFormValues'
import { useValidateCommonFormFields } from '@/lib/sshoc/validateCommonFormFields'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import { Form } from '@/modules/form/Form'
import { Title } from '@/modules/ui/typography/Title'
import { getSingularItemCategoryLabel } from '@/utils/getSingularItemCategoryLabel'

export type PageKey = 'workflow' | 'steps' | 'step'

export interface ItemFormValues extends WorkflowCore {
  draft?: boolean
  composedOf?: Array<StepCore & { persistentId?: string; dirty?: boolean }>
}

export interface ItemFormProps<T> {
  id: string
  category: ItemCategory
  initialValues?: Partial<T>
  item?: WorkflowDto
}

/**
 * Item edit form.
 */
export function ItemForm(props: ItemFormProps<ItemFormValues>): JSX.Element {
  const { id, category, initialValues } = props

  const categoryLabel = getSingularItemCategoryLabel(category)
  const stepLabel = getSingularItemCategoryLabel('step')

  const useItemMutation = useUpdateWorkflow

  const isReviewToApprove = useQueryParam('review', false, Boolean)

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
  const updateStep = useUpdateStep({
    onError(error) {
      toast.error(
        `Failed to ${isAllowedToPublish ? 'publish' : 'submit'} ${stepLabel}.`,
      )

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
  })
  const updateWorkflow = useItemMutation({
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
      queryKey: ['getWorkflows'],
    })
    queryClient.invalidateQueries({
      queryKey: ['getWorkflow', { persistentId: data.persistentId }],
    })
    if (data.status === 'draft') {
      queryClient.invalidateQueries({
        queryKey: ['getMyDraftItems'],
      })
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

    const updatedWorkflow = await updateWorkflow.mutateAsync([
      { persistentId: id },
      { draft },
      workflow,
      { token: auth.session.accessToken },
    ])

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const workflowId = updatedWorkflow.persistentId!

    /**
     * We cannot dispatch all at once with Promise,all because this crashes the backend.
     * create/update step operations must be run sequentially.
     */
    await (composedOf ?? []).reduce((operations, { dirty, ...data }, index) => {
      return operations.then(() => {
        const step = { ...data, stepNo: index + 1 }

        /** Step has an id, so it's an updated operation. */
        if (step.persistentId !== undefined) {
          const originalStep = props.item?.composedOf?.[index]

          /**
           * Step has either been edited (dirty), or has been re-ordered,
           * in which case the id at the index differs from the one in the
           * original workflow. Othewwise, there's nothing to do.
           */
          if (
            dirty === true ||
            step.persistentId !== originalStep?.persistentId
          ) {
            return updateStep.mutateAsync([
              {
                persistentId: workflowId,
                stepPersistentId: step.persistentId,
              },
              { draft },
              sanitizeFormValues(step),
              { token: auth.session?.accessToken },
            ])
          } else {
            return Promise.resolve()
          }
        }

        return createStep.mutateAsync([
          { persistentId: workflowId },
          { draft },
          sanitizeFormValues(step),
          { token: auth.session?.accessToken },
        ])
      })
    }, Promise.resolve() as any)

    /** This will only get called when the above didn't throw. */
    onSuccess(updatedWorkflow)

    /**
     * If `onSubmit` resolves to `undefined` it's a successful submit.
     * If the promise resolves to something else the submit has failed.
     * If the promise rejects it's a network error (or similar).
     */
    return Promise.resolve()
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
      onValidate?: FormConfig<Partial<ItemFormValues>>['validate']
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
    if (currentPageKey === 'steps') {
      return onSubmit(values as ItemFormValues)
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
      Object.values(pageStatus).every((pristine) => pristine === true) &&
      isReviewToApprove !== true
    )
  }

  return (
    <Form
      onSubmit={handleSubmit}
      validate={validate}
      initialValues={state.values}
    >
      {({ handleSubmit, form, pristine, invalid, submitting, values }) => {
        return (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col space-y-12"
          >
            <div className="flex items-center justify-between space-x-12">
              <Title>
                {currentPageKey === 'step' ? 'Add step' : 'Edit workflow'}
              </Title>
              {currentPageKey !== 'step' ? (
                <div className="flex items-center space-x-12">
                  <ActionButton
                    onPress={() => {
                      updatePageStatus(pristine)
                      onSetPage('workflow')
                    }}
                    isDisabled={currentPageKey === 'workflow'}
                    className={cx(
                      'group inline-flex items-center space-x-4 font-body focus:outline-none',
                      currentPageKey === 'workflow'
                        ? 'pointer-events-none'
                        : '',
                    )}
                  >
                    <span
                      className={cx(
                        'w-8 h-8 transition flex items-center justify-center flex-shrink-0 border rounded-full text-sm ',
                        currentPageKey === 'workflow'
                          ? 'text-white bg-secondary-600 border-secondary-600'
                          : 'text-gray-600 bg-gray-50 border-gray-300 group-hover:text-white group-hover:bg-secondary-600 group-hover:border-secondary-600 group-focus:text-white group-focus:bg-secondary-600 group-focus:border-secondary-600',
                      )}
                    >
                      1
                    </span>
                    <span
                      className={cx(
                        currentPageKey === 'workflow'
                          ? 'text-gray-800'
                          : 'text-primary-750',
                        'transition group-hover:text-secondary-600',
                      )}
                    >
                      Workflow details
                    </span>
                  </ActionButton>
                  <ActionButton
                    type="submit"
                    onPress={() => {
                      updatePageStatus(pristine)
                    }}
                    isDisabled={currentPageKey === 'steps'}
                    className={cx(
                      'group inline-flex items-center space-x-4 font-body focus:outline-none',
                      currentPageKey === 'steps' ? 'pointer-events-none' : '',
                    )}
                  >
                    <span
                      className={cx(
                        'w-8 h-8 transition flex items-center justify-center flex-shrink-0 border rounded-full text-sm',
                        currentPageKey === 'steps'
                          ? 'text-white bg-secondary-600 border-secondary-600'
                          : 'text-gray-600 bg-gray-50 border-gray-300 group-hover:text-white group-hover:bg-secondary-600 group-hover:border-secondary-600 group-focus:text-white group-focus:bg-secondary-600 group-focus:border-secondary-600',
                      )}
                    >
                      2
                    </span>
                    <span
                      className={cx(
                        currentPageKey === 'steps'
                          ? 'text-gray-800'
                          : invalid
                          ? 'text-gray-800'
                          : 'text-primary-750',
                        'transition group-hover:text-secondary-600',
                      )}
                    >
                      Workflow steps
                    </span>
                  </ActionButton>
                </div>
              ) : null}
            </div>
            <Page
              onSetPage={onSetPage}
              prefix={state.prefix}
              item={props.item}
            />
            <div className="flex items-center justify-end space-x-6">
              <Button onPress={onCancel} variant="link">
                Cancel
              </Button>
              {currentPageKey === 'steps' ? (
                <Fragment>
                  <Button
                    type="submit"
                    onPress={() => {
                      form.change('draft', true)
                    }}
                    isDisabled={
                      submitting ||
                      updateWorkflow.isLoading ||
                      updateStep.isLoading ||
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
                      submitting ||
                      updateWorkflow.isLoading ||
                      updateStep.isLoading ||
                      createStep.isLoading
                    }
                  >
                    {isAllowedToPublish ? 'Publish' : 'Submit'}
                  </Button>
                </Fragment>
              ) : currentPageKey === 'step' ? (
                <Button
                  type="submit"
                  onPress={() => {
                    /** mark step as dirty on submit. yuck! */
                    const prefix = state.prefix?.slice(0, -1)
                    if (prefix != null && prefix.length > 0) {
                      const step = get(values, prefix)
                      if (step != null) {
                        console.log('Setting step to dirty')
                        step.dirty = !pristine
                      }
                    }

                    updatePageStatus(pristine)
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  type="submit"
                  onPress={() => {
                    updatePageStatus(pristine)
                  }}
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
  item?: WorkflowDto
}

function WorkflowPage(props: FormPageProps) {
  return (
    <Fragment>
      <MainFormSection />
      <ActorsFormSection initialValues={{ ...props.item }} />
      <PropertiesFormSection initialValues={{ ...props.item }} />
      <MediaFormSection initialValues={{ ...props.item }} />
      <ThumbnailFormSection initialValues={{ ...props.item }} />
      <RelatedItemsFormSection initialValues={{ ...props.item }} />
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
  const initialValues = prefix
    ? get(props.item, prefix.slice(0, -1))
    : undefined

  return (
    <Fragment>
      <MainFormSection prefix={prefix} />
      <ActorsFormSection prefix={prefix} initialValues={{ ...initialValues }} />
      <PropertiesFormSection
        prefix={prefix}
        initialValues={{ ...initialValues }}
      />
      <RelatedItemsFormSection
        prefix={prefix}
        initialValues={{ ...initialValues }}
      />
    </Fragment>
  )
}

interface ActionButtonProps extends AriaButtonProps {
  className?: string
}

function ActionButton({ className, ...props }: ActionButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  return (
    <button className={className} {...buttonProps} ref={ref}>
      {props.children}
    </button>
  )
}
