import type { FormApi, SubmissionErrors } from 'final-form'
import { useFieldArray } from 'react-final-form-arrays'

import { FormControls } from '@/components/common/FormControls'
import { FormFieldArray } from '@/components/common/FormFieldArray'
import { FormFieldArrayControls } from '@/components/common/FormFieldArrayControls'
import { FormFieldList } from '@/components/common/FormFieldList'
import { FormRecordAddButton } from '@/components/common/FormRecordAddButton'
import { FormSections } from '@/components/common/FormSections'
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
import { WorkflowStepPreview } from '@/components/item-form/WorkflowStepPreview'
import { WorkflowTitle } from '@/components/item-form/WorkflowTitle'
import type { ItemsDiff } from '@/data/sshoc/api/item'
import type { Workflow, WorkflowInput } from '@/data/sshoc/api/workflow'
import type { WorkflowStep, WorkflowStepInput } from '@/data/sshoc/api/workflow-step'
import { workflowWithStepsInputSchema } from '@/data/sshoc/validation-schemas/workflow'
import type { FormProps } from '@/lib/core/form/Form'
import { Form } from '@/lib/core/form/Form'
import { FormButton } from '@/lib/core/form/FormButton'
import { FormButtonLink } from '@/lib/core/form/FormButtonLink'
import { validateSchema } from '@/lib/core/form/validateSchema'
import { useI18n } from '@/lib/core/i18n/useI18n'

export type WorkflowFormValues = WorkflowInput & {
  persistentId?: Workflow['persistentId']
  status?: Workflow['status']
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

  function onSubmitPage(
    values: WorkflowFormValues,
    form: FormApi<WorkflowFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    switch (page.type) {
      case 'workflow':
        done?.()
        setPage({ type: 'steps' })
        break
      case 'steps':
        onSubmit(values, form, done)
        break
      case 'step':
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

  // TODO: Avoid validating whole form for single step
  const _validate = validateSchema(workflowWithStepsInputSchema)

  return (
    <Form
      initialValues={initialValuesWithDeletedFields}
      name={name}
      onSubmit={onSubmitPage}
      validate={_validate}
    >
      <ReviewFormMetadata diff={diff}>
        {page.type === 'workflow' ? <WorkflowFormSections onCancel={onCancel} /> : null}
        {page.type === 'steps' ? (
          <FormSections>
            <WorkflowStepsFormSection setPage={setPage} />

            <ItemReviewFormControls<WorkflowFormValues> onReject={onReject} onCancel={onCancel} />
          </FormSections>
        ) : null}
        {page.type === 'step' ? (
          <WorkflowStepFormSections index={page.index} onCancel={onCancelStep} />
        ) : null}
      </ReviewFormMetadata>
    </Form>
  )
}

interface WorkflowFormSectionsProps {
  onCancel: () => void
}

function WorkflowFormSections(props: WorkflowFormSectionsProps): JSX.Element {
  const { onCancel } = props

  const { t } = useI18n<'authenticated' | 'common'>()
  const formFields = useWorkflowFormFields()

  /**
   * Work around a bug in `final-form`: with async validation, when we change from workflow
   * to steps page, `final-form` tries to update the state of the `composedOf` field,
   * but it will be missing in `safeFields` if not previously registered (which we ensure here).
   *
   * @see https://github.com/final-form/final-form/issues/411
   */
  useFieldArray<WorkflowStepInput | undefined>('composedOf')

  return (
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
        <FormButton type="submit">{t(['authenticated', 'controls', 'next'])}</FormButton>
      </FormControls>
    </FormSections>
  )
}

interface WorkflowStepsFormSectionProps {
  setPage: WorkflowReviewFormProps['setPage']
}

function WorkflowStepsFormSection(props: WorkflowStepsFormSectionProps): JSX.Element {
  const { setPage } = props

  const { t } = useI18n<'authenticated' | 'common'>()
  const fieldArray = useFieldArray<UndefinedLeaves<WorkflowStepInput> | WorkflowStepInput>(
    'composedOf',
  )

  function onAdd() {
    const index = fieldArray.fields.length ?? 0
    setPage({
      type: 'step',
      index,
      onReset: () => {
        fieldArray.fields.remove(index)
      },
    })
    fieldArray.fields.push({ label: undefined, description: undefined })
  }

  return (
    <FormFieldArray>
      <WorkflowTitle />
      <FormFieldList>
        {fieldArray.fields.map((name, index) => {
          function onEdit() {
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

interface WorkflowStepFormSectionsProps {
  index: number
  onCancel: () => void
}

function WorkflowStepFormSections(props: WorkflowStepFormSectionsProps): JSX.Element {
  const { index, onCancel } = props

  const { t } = useI18n<'authenticated' | 'common'>()
  const name = `composedOf[${index}]`
  const formFields = useWorkflowStepFormFields(name)

  return (
    <FormSections>
      <MainReviewFormSection formFields={formFields} />
      <PropertyReviewFormSection formFields={formFields} />
      <MediaReviewFormSection formFields={formFields} />
      <RelatedReviewItemFormSection formFields={formFields} />

      <FormControls>
        <FormButtonLink onPress={onCancel}>
          {t(['authenticated', 'controls', 'cancel'])}
        </FormButtonLink>
        <FormButton type="submit">{t(['authenticated', 'controls', 'save'])}</FormButton>
      </FormControls>
    </FormSections>
  )
}
