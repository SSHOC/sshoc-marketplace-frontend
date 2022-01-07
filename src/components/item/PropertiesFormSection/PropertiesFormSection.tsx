import { Dialog } from '@reach/dialog'
import { camelCase } from 'change-case'
import { Fragment, useEffect, useMemo, useState } from 'react'
import type { QueryObserverResult } from 'react-query'
import { useQueryClient } from 'react-query'

import type {
  ConceptCore,
  PaginatedPropertyTypes,
  PropertyTypeDto,
  SearchConcept,
  VocabularyBasicDto,
} from '@/api/sshoc'
import {
  useCreateConcept,
  useGetPropertyTypes,
  useSearchConcepts,
} from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { useToast } from '@/elements/Toast/useToast'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { useAuth } from '@/modules/auth/AuthContext'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { Form } from '@/modules/form/Form'
import { FormField } from '@/modules/form/FormField'
import { FormFieldArray } from '@/modules/form/FormFieldArray'
import { FormFieldCondition } from '@/modules/form/FormFieldCondition'
import helpText from '@@/config/form-helptext.json'

export interface PropertiesFormSectionProps {
  initialValues?: any
  prefix?: string
}

/**
 * Form section for item properties.
 */
export function PropertiesFormSection(
  props: PropertiesFormSectionProps,
): JSX.Element {
  const auth = useAuth()

  const prefix = props.prefix ?? ''

  const propertyTypes = useGetPropertyTypes(
    {
      /** try to get everything in one go, so we don't need a combobox here */
      perpage: 100,
    },
    {
      select(data) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data.propertyTypes?.sort((a, b) => a.label!.localeCompare(b.label!))
        return data
      },
    },
    {
      token: auth.session?.accessToken,
    },
  )
  const propertyTypesById = useMemo(() => {
    const map = {} as Record<string, PropertyTypeDto>

    if (propertyTypes.data === undefined) return map

    propertyTypes.data.propertyTypes?.forEach((propertyType) => {
      if (propertyType.code !== undefined) {
        map[propertyType.code] = propertyType
      }
    })

    return map
  }, [propertyTypes.data])

  const [showSuggestConceptDialog, setShowSuggestConceptDialog] = useState(
    false,
  )
  const [propertyTypeIdForDialog, setPropertyTypeIdForDialog] = useState<
    string | null
  >(null)
  function openSuggestConceptDialog(propertyTypeId: string) {
    setPropertyTypeIdForDialog(propertyTypeId)
    setShowSuggestConceptDialog(true)
  }
  function closeSuggestConceptDialog() {
    setPropertyTypeIdForDialog(null)
    setShowSuggestConceptDialog(false)
  }

  return (
    <FormSection title={'Properties'}>
      <FormFieldArray name={`${prefix}properties`}>
        {({ fields }) => {
          return (
            <FormRecords>
              {fields.map((name, index) => {
                return (
                  /** Don't display hidden properties */
                  <FormFieldCondition
                    key={name}
                    name={`${name}.type.hidden`}
                    condition={(hidden) => {
                      /** Always show hidden properties for admins. */
                      /** Requires that `property-types` are fetch with token. */
                      if (auth.session?.user.username === 'Administrator') {
                        return true
                      }

                      return hidden !== true
                    }}
                  >
                    <FormRecord
                      key={name}
                      actions={
                        <FormFieldRemoveButton
                          onPress={() => {
                            fields.remove(index)
                            /** YUCK! */
                            if (
                              Array.isArray(props.initialValues?.properties)
                            ) {
                              props.initialValues.properties.splice(index, 1)
                            }
                          }}
                          aria-label={'Remove property'}
                        />
                      }
                    >
                      <PropertyTypeSelect
                        name={`${name}.type.code`}
                        label={'Property type'}
                        propertyTypes={propertyTypes}
                      />
                      <FormFieldCondition
                        name={`${name}.type.code`}
                        condition={(id) =>
                          id !== '' &&
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                          propertyTypesById[id] !== undefined &&
                          propertyTypesById[id].type === 'concept'
                        }
                      >
                        {(id: string) => {
                          return (
                            <Fragment>
                              <PropertyConceptComboBox
                                name={`${name}.concept.uri`}
                                parentName={name}
                                label={'Concept'}
                                propertyTypeId={id}
                                initialValues={props.initialValues}
                                index={index}
                              />
                              {propertyTypesById[id].allowedVocabularies?.every(
                                (vocab) => vocab.closed === false,
                              ) === true ? (
                                <button
                                  className="text-ui-base text-primary-750 hover:text-secondary-600"
                                  onClick={() => {
                                    openSuggestConceptDialog(id)
                                  }}
                                >
                                  Suggest new concept
                                </button>
                              ) : null}
                            </Fragment>
                          )
                        }}
                      </FormFieldCondition>
                      <FormFieldCondition
                        name={`${name}.type.code`}
                        condition={(id) =>
                          id !== '' &&
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                          propertyTypesById[id] !== undefined &&
                          propertyTypesById[id].type !== 'concept'
                        }
                      >
                        {(id: string) => {
                          return (
                            <FormTextField
                              name={`${name}.value`}
                              label={'Value'}
                              variant="form"
                              style={{ flex: 1 }}
                              // @ts-expect-error It's ok
                              helpText={helpText.properties[id]}
                            />
                          )
                        }}
                      </FormFieldCondition>
                    </FormRecord>
                  </FormFieldCondition>
                )
              })}
              <FormFieldAddButton onPress={() => fields.push(undefined)}>
                {'Add property'}
              </FormFieldAddButton>
            </FormRecords>
          )
        }}
      </FormFieldArray>
      <SuggestConceptDialog
        isOpen={showSuggestConceptDialog}
        onDismiss={closeSuggestConceptDialog}
        propertyType={
          propertyTypeIdForDialog != null
            ? propertyTypesById[propertyTypeIdForDialog]
            : undefined
        }
      />
    </FormSection>
  )
}

interface PropertyTypeSelectProps {
  name: string
  label: string
  propertyTypes: QueryObserverResult<PaginatedPropertyTypes, unknown>
}

/**
 * Property type.
 */
function PropertyTypeSelect(props: PropertyTypeSelectProps): JSX.Element {
  return (
    <FormSelect
      name={props.name}
      label={props.label}
      items={props.propertyTypes.data?.propertyTypes ?? []}
      isLoading={props.propertyTypes.isLoading}
      variant="form"
    >
      {(item) => (
        <FormSelect.Item key={item.code}>{item.label}</FormSelect.Item>
      )}
    </FormSelect>
  )
}

interface PropertyConceptComboBoxProps {
  name: string
  parentName: string
  label: string
  propertyTypeId?: string
  initialValues?: any
  index: number
}

/**
 * Property concept.
 *
 * The form control displays the concept `uri`, but we also need to submit
 * the concept `id` and vocabulary `id`.
 */
function PropertyConceptComboBox(
  props: PropertyConceptComboBoxProps,
): JSX.Element {
  /**
   * Populate the input field with the label of the initially selected item (if any),
   * which triggers a search request. The result set should include the initial item.
   *
   * TODO: should the initial value always be included in the combobox options?
   */
  const initialLabel =
    props.initialValues?.properties?.[props.index]?.concept?.label ?? ''

  const [searchTerm, setSearchTerm] = useState(initialLabel)
  const debouncedSearchTerm = useDebouncedState(searchTerm, 150).trim()
  const concepts = useSearchConcepts(
    {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      types: [String(props.propertyTypeId)!],
      q: debouncedSearchTerm,
      /* vocabs like nemo-activity-type or tadirah-activity can have very many very similarly named entries */
      // perpage: 50,
    },
    {
      // debouncedsearchTerm.length > 2 &&
      enabled: props.propertyTypeId != null,
      keepPreviousData: true,
    },
  )

  useEffect(() => {
    setSearchTerm(initialLabel)
  }, [initialLabel])

  const conceptsByUri = useMemo(() => {
    const map: Record<string, SearchConcept> = {}

    if (concepts.data === undefined) return map

    concepts.data.concepts?.forEach((concept) => {
      if (concept.uri !== undefined) {
        map[concept.uri] = concept
      }
    })

    return map
  }, [concepts.data])

  return (
    <Fragment>
      <FormComboBox
        name={props.name}
        label={props.label}
        items={concepts.data?.concepts ?? []}
        isLoading={concepts.isLoading}
        onInputChange={setSearchTerm}
        variant="form"
        style={{ flex: 1 }}
        helpText={
          props.propertyTypeId != null
            ? // @ts-expect-error It's ok
              helpText.properties[props.propertyTypeId]
            : undefined
        }
      >
        {(item) => (
          <FormComboBox.Item key={item.uri}>{item.label}</FormComboBox.Item>
        )}
      </FormComboBox>
      <FormFieldCondition name={props.name} condition={(id) => id !== ''}>
        {(id: string) => {
          const concept = conceptsByUri[id]

          if (concept === undefined) return null

          return (
            <Fragment>
              <FormField
                name={`${props.parentName}.concept.code`}
                value={concept.code}
                type="hidden"
                component="input"
              />
              <FormField
                name={`${props.parentName}.concept.vocabulary.code`}
                value={concept.vocabulary?.code}
                type="hidden"
                component="input"
              />
            </Fragment>
          )
        }}
      </FormFieldCondition>
    </Fragment>
  )
}

interface SuggestConceptDialogProps {
  isOpen: boolean
  onDismiss: () => void
  propertyType?: PropertyTypeDto
}

/**
 * Dialog to suggest new candidate concept to be included in a vocabulary.
 */
function SuggestConceptDialog(props: SuggestConceptDialogProps) {
  const createConcept = useCreateConcept()
  const auth = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  function onSubmit(unsanitized: ConceptFormValues) {
    if (auth.session?.accessToken === undefined) {
      toast.error('Authentication required.')
      return Promise.reject()
    }

    const { vocabularyId, ...values } = sanitizeConceptFormValues(unsanitized)

    return createConcept.mutateAsync(
      [
        { 'vocabulary-code': vocabularyId },
        { candidate: true },
        values,
        { token: auth.session.accessToken },
      ],
      {
        onSuccess() {
          queryClient.invalidateQueries(['searchConcepts'])
          queryClient.invalidateQueries(['getAllConceptRelations'])
          queryClient.invalidateQueries([
            'getVocabulary',
            { code: vocabularyId },
          ])
          toast.success('Sucessfully suggested concept.')
        },
        onError() {
          toast.error('Failed to suggest concept.')
        },
        onSettled() {
          props.onDismiss()
        },
      },
    )
  }

  if (props.propertyType == null) {
    return null
  }

  return (
    <Dialog
      isOpen={props.isOpen}
      onDismiss={props.onDismiss}
      className="flex flex-col w-full max-w-screen-lg px-32 py-16 mx-auto bg-white rounded shadow-lg"
      style={{ width: '60vw', marginTop: '10vh', marginBottom: '10vh' }}
      aria-label="Suggest new candidate concept"
    >
      <button
        onClick={props.onDismiss}
        className="self-end"
        aria-label="Close dialog"
      >
        <Icon icon={CloseIcon} className="" />
      </button>
      <section className="flex flex-col space-y-6">
        <h2 className="text-2xl font-medium">Suggest new concept</h2>
        {/* this form is rendered in a portal, so it's valid html, even though it's a <form> "nested" in another <form>. */}
        <CreateConceptForm
          onDismiss={props.onDismiss}
          onSubmit={onSubmit}
          isLoading={createConcept.isLoading}
          buttonLabel="Suggest"
          allowedVocabularies={props.propertyType.allowedVocabularies!}
        />
      </section>
    </Dialog>
  )
}

type ConceptFormValues = ConceptCore & { vocabularyId: string }

interface CreateConceptFormProps {
  onDismiss: () => void
  initialValues?: ConceptFormValues
  onSubmit: (actor: ConceptFormValues) => void
  isLoading: boolean
  buttonLabel: string
  allowedVocabularies: Array<VocabularyBasicDto>
}

/**
 * Create concept.
 */
function CreateConceptForm(props: CreateConceptFormProps) {
  const { initialValues, onSubmit, isLoading, buttonLabel } = props

  function onValidate(values: Partial<ConceptFormValues>) {
    const errors: Partial<Record<keyof typeof values, any>> = {}

    return errors
  }

  return (
    <Form
      onSubmit={onSubmit}
      validate={onValidate}
      initialValues={initialValues}
    >
      {({ handleSubmit, submitting, pristine, invalid }) => {
        return (
          <form
            noValidate
            className="flex flex-col space-y-6"
            onSubmit={handleSubmit}
          >
            <FormSelect
              isRequired
              name="vocabularyId"
              label="Vocabulary"
              items={props.allowedVocabularies ?? []}
              variant="form"
              style={{ flex: 1 }}
            >
              {(item) => {
                /** Unfortunately we have concepts with empty string labels on -dev instance. */
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                const label = item.label || item.code
                return (
                  <FormSelect.Item key={item.code} textValue={label}>
                    {label}
                  </FormSelect.Item>
                )
              }}
            </FormSelect>
            <FormTextField
              name="label"
              label="Label"
              isRequired
              variant="form"
              style={{ flex: 1 }}
            />
            <FormTextField
              name="notation"
              label="Notation"
              variant="form"
              style={{ flex: 1 }}
            />
            <FormTextField
              name="definition"
              label="Definition"
              variant="form"
              style={{ flex: 1 }}
            />
            {/* <FormTextField
              name="uri"
              label="URI"
              variant="form"
              style={{ flex: 1 }}
            /> */}
            {/* TODO: Related Concepts */}
            <div className="flex justify-end space-x-12">
              <Button variant="link" onPress={props.onDismiss}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                isDisabled={submitting || isLoading}
              >
                {buttonLabel}
              </Button>
            </div>
          </form>
        )
      }}
    </Form>
  )
}

function sanitizeConceptFormValues(unsanitizedValues: ConceptFormValues) {
  const values = {
    ...unsanitizedValues,
    /** Auto-generate concept id from label. */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    code: camelCase(unsanitizedValues.label!),
  }

  return values
}
