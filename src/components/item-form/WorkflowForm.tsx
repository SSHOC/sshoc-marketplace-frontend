import type { FormApi, SubmissionErrors } from 'final-form'
import { useForm } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'

import { FormControls } from '@/components/common/FormControls'
import { FormFieldArray } from '@/components/common/FormFieldArray'
import { FormFieldArrayControls } from '@/components/common/FormFieldArrayControls'
import { FormFieldList } from '@/components/common/FormFieldList'
import { FormRecordAddButton } from '@/components/common/FormRecordAddButton'
import { FormSections } from '@/components/common/FormSections'
import { ActorFormSection } from '@/components/item-form/ActorFormSection'
import { DateFormSection } from '@/components/item-form/DateFormSection'
import { ItemFormControls } from '@/components/item-form/ItemFormControls'
import { MainFormSection } from '@/components/item-form/MainFormSection'
import { MediaFormSection } from '@/components/item-form/MediaFormSection'
import { PropertyFormSection } from '@/components/item-form/PropertyFormSection'
import { RelatedItemFormSection } from '@/components/item-form/RelatedItemFormSection'
import { removeEmptyItemFieldsOnSubmit } from '@/components/item-form/removeEmptyItemFieldsOnSubmit'
import { ThumbnailFormSection } from '@/components/item-form/ThumbnailFormSection'
import { useItemFormErrorMap } from '@/components/item-form/useItemFormErrorMap'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { useWorkflowFormFields } from '@/components/item-form/useWorkflowFormFields'
import type { WorkflowFormPage } from '@/components/item-form/useWorkflowFormPage'
import { useWorkflowStepFormFields } from '@/components/item-form/useWorkflowStepFormFields'
import { WorkflowStepPreview } from '@/components/item-form/WorkflowStepPreview'
import { WorkflowTitle } from '@/components/item-form/WorkflowTitle'
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
  __draft__?: boolean
  __submitting__?: boolean
  composedOf?: Array<WorkflowStepInput & { persistentId?: WorkflowStep['persistentId'] }>
}

export interface WorkflowFormProps extends FormProps<WorkflowFormValues> {
  name?: string
  onCancel: () => void
  formFields: ItemFormFields
  page: WorkflowFormPage
  setPage: (page: WorkflowFormPage | ((page: WorkflowFormPage) => WorkflowFormPage)) => void
}

export function WorkflowForm(props: WorkflowFormProps): JSX.Element {
  const { formFields, initialValues, name, onCancel, onSubmit, validate, page, setPage } = props

  function onBeforeSaveAsDraft(form: FormApi<WorkflowFormValues>) {
    form.batch(() => {
      form.change('__draft__', true)
      form.change('__submitting__', true)
    })
  }

  function onBeforeSubmit(form: FormApi<WorkflowFormValues>) {
    form.batch(() => {
      form.change('__draft__', false)
      form.change('__submitting__', true)
    })
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

  // TODO: Avoid validating whole form for single step
  // TODO: preprocess with removeEmptyFields only when creatring new workflow
  const errorMap = useItemFormErrorMap()
  const _validate = validateSchema(
    workflowWithStepsInputSchema,
    errorMap,
    removeEmptyItemFieldsOnSubmit,
  )

  return (
    <Form initialValues={initialValues} name={name} onSubmit={onSubmitPage} validate={_validate}>
      {page.type === 'workflow' ? (
        <WorkflowFormSections onCancel={onCancel} onBeforeSubmit={onBeforeSubmit} />
      ) : null}
      {page.type === 'steps' ? (
        <FormSections>
          <WorkflowStepsFormSection setPage={setPage} />

          <ItemFormControls<WorkflowFormValues>
            onBeforeSaveAsDraft={onBeforeSaveAsDraft}
            onBeforeSubmit={onBeforeSubmit}
            onCancel={onCancel}
          />
        </FormSections>
      ) : null}
      {page.type === 'step' ? (
        <WorkflowStepFormSections index={page.index} onCancel={onCancelStep} />
      ) : null}
    </Form>
  )
}

interface WorkflowFormSectionsProps {
  onCancel: () => void
  onBeforeSubmit?: (form: FormApi<WorkflowFormValues>) => void
}

function WorkflowFormSections(props: WorkflowFormSectionsProps): JSX.Element {
  const { onCancel } = props

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
  useFieldArray<WorkflowStepInput | undefined>('composedOf')

  function onBeforeSubmit() {
    props.onBeforeSubmit?.(form)
  }

  return (
    <FormSections>
      <MainFormSection formFields={formFields} />
      <DateFormSection formFields={formFields} />
      <ActorFormSection formFields={formFields} />
      <PropertyFormSection formFields={formFields} />
      <MediaFormSection formFields={formFields} />
      <ThumbnailFormSection formFields={formFields} />
      <RelatedItemFormSection formFields={formFields} />

      <FormControls>
        <FormButtonLink onPress={onCancel}>
          {t(['authenticated', 'controls', 'cancel'])}
        </FormButtonLink>
        <FormButton onPress={onBeforeSubmit} type="submit">
          {t(['authenticated', 'controls', 'next'])}
        </FormButton>
      </FormControls>
    </FormSections>
  )
}

interface WorkflowStepsFormSectionProps {
  setPage: WorkflowFormProps['setPage']
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
      <MainFormSection formFields={formFields} />
      <PropertyFormSection formFields={formFields} />
      <MediaFormSection formFields={formFields} />
      <RelatedItemFormSection formFields={formFields} />

      <FormControls>
        <FormButtonLink onPress={onCancel}>
          {t(['authenticated', 'controls', 'cancel'])}
        </FormButtonLink>
        <FormButton type="submit">{t(['authenticated', 'controls', 'save'])}</FormButton>
      </FormControls>
    </FormSections>
  )
}
