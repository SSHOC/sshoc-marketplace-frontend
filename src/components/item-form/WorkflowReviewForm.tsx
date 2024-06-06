import type { FormApi, SubmissionErrors } from 'final-form'
import { Fragment } from 'react'
import { Field, FormSpy, useForm } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'

import { FormControls } from '@/components/common/FormControls'
import { FormFieldArray } from '@/components/common/FormFieldArray'
import { FormFieldArrayControls } from '@/components/common/FormFieldArrayControls'
import { FormFieldList } from '@/components/common/FormFieldList'
import { FormRecordAddButton } from '@/components/common/FormRecordAddButton'
import { FormSections } from '@/components/common/FormSections'
import { SearchResult } from '@/components/common/SearchResult'
import { SearchResultTitle } from '@/components/common/SearchResultTitle'
import { ActorReviewFormSection } from '@/components/item-form/ActorReviewFormSection'
import { DateReviewFormSection } from '@/components/item-form/DateReviewFormSection'
import { ItemReviewFormControls } from '@/components/item-form/ItemReviewFormControls'
import { MainReviewFormSection } from '@/components/item-form/MainReviewFormSection'
import { MediaReviewFormSection } from '@/components/item-form/MediaReviewFormSection'
import { OtherSuggestedItemVersionsFormSection } from '@/components/item-form/OtherSuggestedItemVersionsFormSection'
import { PropertyReviewFormSection } from '@/components/item-form/PropertyReviewFormSection'
import { RelatedReviewItemFormSection } from '@/components/item-form/RelatedReviewItemFormSection'
import { ReviewFormMetadata } from '@/components/item-form/ReviewFormMetadata'
import { ThumbnailReviewFormSection } from '@/components/item-form/ThumbnailReviewFormSection'
import { useItemDiffFormInitialValues } from '@/components/item-form/useItemDiffFormInitialValues'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { useWorkflowFormFields } from '@/components/item-form/useWorkflowFormFields'
import type { WorkflowFormPage } from '@/components/item-form/useWorkflowFormPage'
import { useWorkflowStepFormFields } from '@/components/item-form/useWorkflowStepFormFields'
import { useWorkflowStepFormRecommendedFields } from '@/components/item-form/useWorkflowStepFormRecommendedFields'
import { WorkflowFormNavigation } from '@/components/item-form/WorkflowFormNavigation'
import { WorkflowStepPreview } from '@/components/item-form/WorkflowStepPreview'
import { WorkflowTitle } from '@/components/item-form/WorkflowTitle'
import type { ItemsDiff } from '@/data/sshoc/api/item'
import type { Workflow, WorkflowInput } from '@/data/sshoc/api/workflow'
import type { WorkflowStep, WorkflowStepInput } from '@/data/sshoc/api/workflow-step'
import type { FormProps } from '@/lib/core/form/Form'
import { Form } from '@/lib/core/form/Form'
import { FormButton } from '@/lib/core/form/FormButton'
import { FormButtonLink } from '@/lib/core/form/FormButtonLink'
import { useFieldState } from '@/lib/core/form/useFieldState'
import { useI18n } from '@/lib/core/i18n/useI18n'

export type WorkflowFormValues = WorkflowInput & {
  persistentId?: Workflow['persistentId']
  status?: Workflow['status']
  __submitting__?: boolean
  composedOf?: Array<WorkflowStepInput & { persistentId?: WorkflowStep['persistentId'] }>
}

export interface WorkflowReviewFormProps extends FormProps<WorkflowFormValues> {
  diff: ItemsDiff | undefined
  name?: string
  onCancel: () => void
  onReject: () => void
  formFields: ItemFormFields
  page: WorkflowFormPage
  setPage: (page: WorkflowFormPage | ((page: WorkflowFormPage) => WorkflowFormPage)) => void
}

export function WorkflowReviewForm(props: WorkflowReviewFormProps): JSX.Element {
  const {
    diff,
    formFields,
    initialValues,
    name,
    onCancel,
    onReject,
    onSubmit,
    validate,
    page,
    setPage,
  } = props

  function onBeforeSubmit(form: FormApi<WorkflowFormValues>) {
    form.change('__submitting__', true)
  }

  function onSubmitPage(
    values: WorkflowFormValues,
    form: FormApi<WorkflowFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    switch (page.type) {
      case 'workflow':
        delete values['__submitting__']
        done?.()
        setPage({ type: 'steps' })
        break
      case 'steps':
        onSubmit(values, form, done)
        break
      case 'step':
        delete values['__submitting__']
        done?.()
        setPage({ type: 'steps' })
        break
    }
  }

  function onCancelStep() {
    if (page.type === 'step') {
      page.onReset()
    }
    setPage({ type: 'steps' })
  }

  const initialValuesWithDeletedFields =
    // FIXME: Make ItemsDiff generic, fix initialValues type
    useItemDiffFormInitialValues({ diff, item: initialValues }) ?? undefined

  return (
    <Form
      initialValues={initialValuesWithDeletedFields}
      name={name}
      onSubmit={onSubmitPage}
      validate={validate}
    >
      <WorkflowFormNavigation onBeforeSubmit={onBeforeSubmit} page={page} setPage={setPage} />
      {page.type === 'workflow' ? (
        <WorkflowFormSections diff={diff} onBeforeSubmit={onBeforeSubmit} onCancel={onCancel} />
      ) : null}
      {page.type === 'steps' ? (
        <FormSections>
          <WorkflowStepsFormSection diff={diff} setPage={setPage} />

          <ItemReviewFormControls<WorkflowFormValues>
            onBeforeSubmit={onBeforeSubmit}
            onReject={onReject}
            onCancel={onCancel}
          />
        </FormSections>
      ) : null}
      {page.type === 'step' ? (
        <WorkflowStepFormSections
          diff={diff}
          index={page.index}
          onBeforeSubmit={onBeforeSubmit}
          onCancel={onCancelStep}
        />
      ) : null}

      {/*
       * This is a hack to avoid unregistering fields, so the diff data attached to fields is not
       * destroyed. Normally, `final-form` will automatically unregister form fields when they
       * leave the dom, and also clear any form field state. Since we attach the diff data to
       * form fields we need to keep it even when we switch screens in the multi-step form.
       * By keeping subscriptions alive in `FormSpy`, we avoid fields being unregistered.
       * An alternative approach would probably require not attaching diff data to the fields,
       * but managing it separately.
       *
       * @see https://github.com/final-form/react-final-form/issues/803
       * @see https://github.com/final-form/react-final-form/issues/639
       */}
      <FormSpy subscription={{ values: true }}>
        {({ values }) => {
          return (
            <>
              {/* eslint-disable arrow-body-style */}
              <Field name="label" render={() => null} subscription={{}} />
              <Field name="description" render={() => null} subscription={{}} />
              <Field name="version" render={() => null} subscription={{}} />
              <Field name="dateCreated" render={() => null} subscription={{}} />
              <Field name="dateLastUpdated" render={() => null} subscription={{}} />
              <Field name="accessibleAt" render={() => null} subscription={{}} />
              <Fragment>
                {values['accessibleAt'].map((_value: unknown, index: number) => {
                  return (
                    <Field
                      key={index}
                      name={`accessibleAt[${index}]`}
                      render={() => null}
                      subscription={{}}
                    />
                  )
                })}
              </Fragment>
              <Field name="externalIds" render={() => null} subscription={{}} />
              <Fragment>
                {values['externalIds'].map((_value: unknown, index: number) => {
                  return (
                    <Field
                      key={index}
                      name={`externalIds[${index}]`}
                      render={() => null}
                      subscription={{}}
                    />
                  )
                })}
              </Fragment>
              <Field name="contributors" render={() => null} subscription={{}} />
              <Fragment>
                {values['contributors'].map((_value: unknown, index: number) => {
                  return (
                    <Field
                      key={index}
                      name={`contributors[${index}]`}
                      render={() => null}
                      subscription={{}}
                    />
                  )
                })}
              </Fragment>
              <Field name="properties" render={() => null} subscription={{}} />
              <Fragment>
                {values['properties'].map((_value: unknown, index: number) => {
                  return (
                    <Field
                      key={index}
                      name={`properties[${index}]`}
                      render={() => null}
                      subscription={{}}
                    />
                  )
                })}
              </Fragment>
              <Field name="media" render={() => null} subscription={{}} />
              <Fragment>
                {values['media'].map((_value: unknown, index: number) => {
                  return (
                    <Field
                      key={index}
                      name={`media[${index}]`}
                      render={() => null}
                      subscription={{}}
                    />
                  )
                })}
              </Fragment>
              <Field name="relatedItems" render={() => null} subscription={{}} />
              <Fragment>
                {values['relatedItems'].map((_value: unknown, index: number) => {
                  return (
                    <Field
                      key={index}
                      name={`relatedItems[${index}]`}
                      render={() => null}
                      subscription={{}}
                    />
                  )
                })}
              </Fragment>
              <Field name="thumbnail" render={() => null} subscription={{}} />
              <Fragment>
                {values['composedOf']?.map((step: any, index: number) => {
                  if (step == null) return null
                  return (
                    <Fragment key={index}>
                      <Field
                        name={`composedOf[${index}].label`}
                        render={() => null}
                        subscription={{}}
                      />
                      <Field
                        name={`composedOf[${index}].description`}
                        render={() => null}
                        subscription={{}}
                      />
                      <Field
                        name={`composedOf[${index}].version`}
                        render={() => null}
                        subscription={{}}
                      />
                      <Field
                        name={`composedOf[${index}].accessibleAt`}
                        render={() => null}
                        subscription={{}}
                      />
                      <Fragment>
                        {step['accessibleAt'].map((_value: unknown, i: number) => {
                          return (
                            <Field
                              key={i}
                              name={`composedOf[${index}].accessibleAt[${i}]`}
                              render={() => null}
                              subscription={{}}
                            />
                          )
                        })}
                      </Fragment>
                      <Field
                        name={`composedOf[${index}].externalIds`}
                        render={() => null}
                        subscription={{}}
                      />
                      <Fragment>
                        {step['externalIds'].map((_value: unknown, i: number) => {
                          return (
                            <Field
                              key={i}
                              name={`composedOf[${index}].externalIds[${i}]`}
                              render={() => null}
                              subscription={{}}
                            />
                          )
                        })}
                      </Fragment>
                      <Field
                        name={`composedOf[${index}].contributors`}
                        render={() => null}
                        subscription={{}}
                      />
                      <Fragment>
                        {step['contributors'].map((_value: unknown, i: number) => {
                          return (
                            <Field
                              key={i}
                              name={`composedOf[${index}].contributors[${i}]`}
                              render={() => null}
                              subscription={{}}
                            />
                          )
                        })}
                      </Fragment>
                      <Field
                        name={`composedOf[${index}].properties`}
                        render={() => null}
                        subscription={{}}
                      />
                      <Fragment>
                        {step['properties'].map((_value: unknown, i: number) => {
                          return (
                            <Field
                              key={i}
                              name={`composedOf[${index}].properties[${i}]`}
                              render={() => null}
                              subscription={{}}
                            />
                          )
                        })}
                      </Fragment>
                      <Field
                        name={`composedOf[${index}].media`}
                        render={() => null}
                        subscription={{}}
                      />
                      <Fragment>
                        {step['media'].map((_value: unknown, i: number) => {
                          return (
                            <Field
                              key={i}
                              name={`composedOf[${index}].media[${i}]`}
                              render={() => null}
                              subscription={{}}
                            />
                          )
                        })}
                      </Fragment>
                      <Field
                        name={`composedOf[${index}].relatedItems`}
                        render={() => null}
                        subscription={{}}
                      />
                      <Fragment>
                        {step['relatedItems'].map((_value: unknown, i: number) => {
                          return (
                            <Field
                              key={i}
                              name={`composedOf[${index}].relatedItems[${i}]`}
                              render={() => null}
                              subscription={{}}
                            />
                          )
                        })}
                      </Fragment>
                      <Field
                        name={`composedOf[${index}].thumbnail`}
                        render={() => null}
                        subscription={{}}
                      />
                    </Fragment>
                  )
                })}
              </Fragment>
              {/* eslint-enable arrow-body-style */}
            </>
          )
        }}
      </FormSpy>
    </Form>
  )
}

interface WorkflowFormSectionsProps {
  onBeforeSubmit?: (form: FormApi<WorkflowFormValues>) => void
  onCancel: () => void
  diff: ItemsDiff | undefined
}

function WorkflowFormSections(props: WorkflowFormSectionsProps): JSX.Element {
  const { diff, onCancel } = props

  const { t } = useI18n<'authenticated' | 'common'>()
  const form = useForm<WorkflowFormValues>()
  const formFields = useWorkflowFormFields()

  /**
   * Work around a bug in `final-form`: with async validation, when we change from workflow
   * to steps page, `final-form` tries to update the state of the `composedOf` field,
   * but it will be missing in `safeFields` if not previously registered (which we ensure here).
   *
   * @see https://github.com/final-form/final-form/issues/411
   */
  useFieldArray<WorkflowStepInput | undefined>('composedOf', { subscription: {} })

  function onBeforeSubmit() {
    props.onBeforeSubmit?.(form)
  }

  return (
    <ReviewFormMetadata diff={diff}>
      <FormSections>
        <MainReviewFormSection formFields={formFields} />
        <DateReviewFormSection formFields={formFields} />
        <ActorReviewFormSection formFields={formFields} />
        <PropertyReviewFormSection formFields={formFields} />
        <MediaReviewFormSection formFields={formFields} />
        <ThumbnailReviewFormSection formFields={formFields} />
        <RelatedReviewItemFormSection formFields={formFields} />

        <OtherSuggestedItemVersionsFormSection />

        <FormControls>
          <FormButtonLink onPress={onCancel}>
            {t(['authenticated', 'controls', 'cancel'])}
          </FormButtonLink>
          <FormButton onPress={onBeforeSubmit} type="submit">
            {t(['authenticated', 'controls', 'next'])}
          </FormButton>
        </FormControls>
      </FormSections>
    </ReviewFormMetadata>
  )
}

interface WorkflowStepsFormSectionProps {
  diff: ItemsDiff | undefined
  setPage: WorkflowReviewFormProps['setPage']
}

function WorkflowStepsFormSection(props: WorkflowStepsFormSectionProps): JSX.Element {
  const { diff, setPage } = props

  const { t } = useI18n<'authenticated' | 'common'>()
  const fieldArray = useFieldArray<UndefinedLeaves<WorkflowStepInput> | WorkflowStepInput>(
    'composedOf',
    { subscription: { value: true } },
  )
  const recommendedFields =
    useWorkflowStepFormRecommendedFields() as UndefinedLeaves<WorkflowStepInput>

  function onAdd() {
    const index = fieldArray.fields.length ?? 0
    setPage({
      type: 'step',
      index,
      onReset: () => {
        fieldArray.fields.remove(index)
      },
    })
    fieldArray.fields.push({ ...recommendedFields, label: undefined, description: undefined })
  }

  return (
    <FormFieldArray>
      <WorkflowTitle />
      <FormFieldList key={fieldArray.fields.length}>
        {fieldArray.fields.map((name, index) => {
          function onEdit() {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const value = fieldArray.fields.value[index]!
            setPage({
              type: 'step',
              index,
              onReset: () => {
                fieldArray.fields.update(index, value)
              },
            })
          }

          function onRemove() {
            fieldArray.fields.remove(index)
          }

          const isFirst = index === 0
          const isLast = index === (fieldArray.fields.length ?? 0) - 1

          function onMoveUp() {
            if (!isFirst) {
              fieldArray.fields.move(index, index - 1)
            }
          }

          function onMoveDown() {
            if (!isLast) {
              fieldArray.fields.move(index, index + 1)
            }
          }

          return (
            <li key={name}>
              <WorkflowStepListItem
                // @ts-expect-error Ignore
                item={diff?.item.composedOf[index]}
                name={name}
                index={index}
                onEdit={onEdit}
                onRemove={onRemove}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                isFirst={isFirst}
                isLast={isLast}
              />
            </li>
          )
        })}
      </FormFieldList>
      <FormFieldArrayControls>
        <FormRecordAddButton onPress={onAdd}>
          {t(['authenticated', 'forms', 'add-workflow-step'])}
        </FormRecordAddButton>
      </FormFieldArrayControls>
    </FormFieldArray>
  )
}

interface WorkflowStepListItemProps {
  item: any
  name: string
  index: number
  onEdit: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

function WorkflowStepListItem(props: WorkflowStepListItemProps) {
  const { item, name, index, onEdit, onRemove, onMoveUp, onMoveDown, isFirst, isLast } = props

  const step = useFieldState<WorkflowStepInput | null>(name).input.value

  /**
   * This can happen in a review form, when the step has been deleted.
   */
  if (step == null) {
    return (
      <SearchResult
        style={{
          border: '1px solid var(--color-negative-200)',
          backgroundColor: 'var(--color-negative-100)',
        }}
      >
        <SearchResultTitle>
          {item.label} (This step has been deleted, or a previous step has been deleted, and now the
          order is messed up)
        </SearchResultTitle>
      </SearchResult>
    )
  }

  return (
    <WorkflowStepPreview
      name={name}
      index={index}
      onEdit={onEdit}
      onRemove={onRemove}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      isFirst={isFirst}
      isLast={isLast}
    />
  )
}

interface WorkflowStepFormSectionsProps {
  index: number
  onBeforeSubmit?: (form: FormApi<WorkflowFormValues>) => void
  onCancel: () => void
  diff: any
}

function WorkflowStepFormSections(props: WorkflowStepFormSectionsProps): JSX.Element {
  const { diff: _diff, index, onCancel } = props

  const { t } = useI18n<'authenticated' | 'common'>()
  const form = useForm<WorkflowFormValues>()
  const name = `composedOf[${index}]`
  const formFields = useWorkflowStepFormFields(name + '.')

  function onBeforeSubmit() {
    props.onBeforeSubmit?.(form)
  }

  const diff = {
    equal: _diff.equal,
    item: _diff.item.composedOf[index] ?? {},
    other: _diff.other.composedOf[index] ?? {},
  }

  return (
    <ReviewFormMetadata diff={diff} prefix={name}>
      <FormSections>
        <MainReviewFormSection formFields={formFields} />
        <PropertyReviewFormSection formFields={formFields} />
        <MediaReviewFormSection formFields={formFields} />
        <RelatedReviewItemFormSection formFields={formFields} />

        <FormControls>
          <FormButtonLink onPress={onCancel}>
            {t(['authenticated', 'controls', 'cancel'])}
          </FormButtonLink>
          <FormButton onPress={onBeforeSubmit} type="submit">
            {t(['authenticated', 'controls', 'save'])}
          </FormButton>
        </FormControls>
      </FormSections>
    </ReviewFormMetadata>
  )
}
