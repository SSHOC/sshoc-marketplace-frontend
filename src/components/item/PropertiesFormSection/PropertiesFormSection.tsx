import { Dialog } from '@reach/dialog'
import { camelCase } from 'change-case'
import get from 'lodash.get'
import { Fragment, useEffect, useMemo, useState } from 'react'
import type { QueryObserverResult } from 'react-query'
import { useQueryClient } from 'react-query'

import type {
  ConceptCore,
  ConceptDto,
  ItemsDifferencesDto,
  PaginatedPropertyTypes,
  PropertyTypeDto,
  SearchConcept,
  VocabularyBasicDto,
} from '@/api/sshoc'
import { useCreateConcept, useGetPropertyTypes, useSearchConcepts } from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { ComboBox } from '@/elements/ComboBox/ComboBox'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { Select } from '@/elements/Select/Select'
import { TextField } from '@/elements/TextField/TextField'
import { useToast } from '@/elements/Toast/useToast'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { useAuth } from '@/modules/auth/AuthContext'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { DiffControls } from '@/modules/form/diff/DiffControls'
import { DiffFieldArray } from '@/modules/form/diff/DiffFieldArray'
import { Form } from '@/modules/form/Form'
import { FormField } from '@/modules/form/FormField'
import { FormFieldCondition } from '@/modules/form/FormFieldCondition'
import helpText from '~/config/form-helptext.json'

export interface PropertiesFormSectionProps {
  initialValues?: any
  prefix?: string
  diff?: ItemsDifferencesDto
}

/**
 * Form section for item properties.
 */
export function PropertiesFormSection(props: PropertiesFormSectionProps): JSX.Element {
  const auth = useAuth()

  const prefix = props.prefix ?? ''
  const isDiffingEnabled = props.diff != null && props.diff.equal === false
  const diff = props.diff ?? {}

  const propertyTypes = useGetPropertyTypes(
    {
      /** try to get everything in one go, so we don't need a combobox here */
      perpage: 100,
    },
    {
      select(data) {
        data.propertyTypes?.sort((a, b) => {
          return a.label!.localeCompare(b.label!)
        })
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

  const [showSuggestConceptDialog, setShowSuggestConceptDialog] = useState(false)
  const [propertyTypeIdForDialog, setPropertyTypeIdForDialog] = useState<string | null>(null)
  function openSuggestConceptDialog(propertyTypeId: string) {
    setPropertyTypeIdForDialog(propertyTypeId)
    setShowSuggestConceptDialog(true)
  }
  function closeSuggestConceptDialog() {
    setPropertyTypeIdForDialog(null)
    setShowSuggestConceptDialog(false)
  }

  /**
   * When a new concept is suggested, it won't immediately show up in the response from
   * `/api/concept-search` because it takes a while for the search index to be updated.
   * So we keep any newly suggested concepts in memory for the lifetime of the form.
   */
  const [suggestedConcepts, setSuggestedConcepts] = useState<
    Record<Exclude<PropertyTypeDto['code'], undefined>, Array<ConceptDto>>
  >({})

  function onConceptSuggested(addedConcept: ConceptDto, propertyType: PropertyTypeDto) {
    setSuggestedConcepts((concepts) => {
      const code = propertyType.code!

      const newConcepts = { ...concepts }
      if (!(code in newConcepts)) {
        newConcepts[code] = []
      }

      newConcepts[code].push(addedConcept)

      return newConcepts
    })
  }

  const propertiesFieldArray = {
    name: `${prefix}properties`,
    label: 'Properties',
    approvedValue: get(diff.item, `${prefix}properties`),
    suggestedValue: get(diff.other, `${prefix}properties`),
  }

  return (
    <Fragment>
      <DiffFieldArray
        name={propertiesFieldArray.name}
        approvedValue={propertiesFieldArray.approvedValue}
        suggestedValue={propertiesFieldArray.suggestedValue}
        actions={({ onAdd, arrayRequiresReview }) => {
          if (arrayRequiresReview === true) return null

          return (
            <FormFieldAddButton
              onPress={() => {
                return onAdd()
              }}
            >
              Add property
            </FormFieldAddButton>
          )
        }}
        isEnabled={isDiffingEnabled}
        wrapper={({ children }) => {
          return <FormSection title={propertiesFieldArray.label}>{children}</FormSection>
        }}
      >
        {({
          name,
          index,
          fields,
          isReviewed,
          status,
          onApprove,
          onReject,
          approvedValue,
          suggestedValue,
          onRemove,
          arrayRequiresReview,
        }) => {
          const requiresReview = status !== 'unchanged' && !isReviewed

          const propertyTypeField = {
            name: `${name}.type.code`,
            label: 'Property type',
            approvedValue: get(approvedValue, 'type.code'),
            approvedItem: get(approvedValue, 'type'),
            suggestedValue: get(suggestedValue, 'type.code'),
            suggestedItem: get(suggestedValue, 'type'),
          }

          const propertyConceptField = {
            name: `${name}.concept.uri`,
            label: 'Concept',
            approvedValue: get(approvedValue, 'concept.uri'),
            approvedItem: get(approvedValue, 'concept'),
            suggestedValue: get(suggestedValue, 'concept.uri'),
            suggestedItem: get(suggestedValue, 'concept'),
          }

          const propertyValueField = {
            name: `${name}.value`,
            label: 'Value',
            approvedValue: get(approvedValue, 'value'),
            suggestedValue: get(suggestedValue, 'value'),
          }

          return (
            <FormFieldCondition
              name={`${name}.type.hidden`}
              condition={(hidden) => {
                /** Always show hidden properties for admins. */
                /** Requires that `property-types` are fetched with token. */
                if (auth.session?.user.username === 'Administrator') {
                  return true
                }

                return hidden !== true
              }}
            >
              {requiresReview ? (
                <FormRecord
                  className="py-2"
                  actions={
                    <DiffControls
                      status={status}
                      onApprove={onApprove}
                      onReject={() => {
                        /** YUCK! */
                        if (index < props.initialValues.properties.length) {
                          props.initialValues.properties[index] = approvedValue
                        }
                        onReject()
                      }}
                    />
                  }
                >
                  <div className="grid content-start gap-1">
                    {status !== 'deleted' ? (
                      <Select
                        label={propertyTypeField.label}
                        isReadOnly
                        variant="form-diff"
                        selectedKey={propertyTypeField.suggestedValue}
                        items={[propertyTypeField.suggestedItem]}
                      >
                        {(item) => {
                          return <Select.Item key={item.code}>{item.label}</Select.Item>
                        }}
                      </Select>
                    ) : null}
                    {status !== 'inserted' ? (
                      <Select
                        {...(status === 'deleted'
                          ? {
                              label: propertyTypeField.label,
                              variant: 'form-diff',
                              style: { textDecoration: 'line-through 2px' },
                            }
                          : {
                              'aria-label': `${propertyTypeField.label} (approved)`,
                              variant: 'form',
                            })}
                        isReadOnly
                        selectedKey={propertyTypeField.approvedValue}
                        items={[propertyTypeField.approvedItem]}
                      >
                        {(item) => {
                          return <Select.Item key={item.code}>{item.label}</Select.Item>
                        }}
                      </Select>
                    ) : null}
                  </div>
                  <div className="grid content-start flex-1 gap-1">
                    {status !== 'deleted' ? (
                      get(suggestedValue, 'type.type') === 'concept' ? (
                        <ComboBox
                          label={propertyConceptField.label}
                          isReadOnly
                          variant="form-diff"
                          selectedKey={propertyConceptField.suggestedValue}
                          items={[propertyConceptField.suggestedItem]}
                          style={{ flex: 1 }}
                        >
                          {(item) => {
                            return <ComboBox.Item key={item.uri}>{item.label}</ComboBox.Item>
                          }}
                        </ComboBox>
                      ) : (
                        <TextField
                          label={propertyValueField.label}
                          isReadOnly
                          variant="form-diff"
                          value={propertyValueField.suggestedValue}
                        />
                      )
                    ) : null}
                    {status !== 'inserted' ? (
                      get(approvedValue, 'type.type') === 'concept' ? (
                        <ComboBox
                          isReadOnly
                          selectedKey={propertyConceptField.approvedValue}
                          items={[propertyConceptField.approvedItem]}
                          {...(status === 'deleted'
                            ? {
                                label: propertyConceptField.label,
                                variant: 'form-diff',
                                style: {
                                  textDecoration: 'line-through 2px',
                                  flex: 1,
                                },
                              }
                            : {
                                'aria-label': `${propertyConceptField.label} (approved)`,
                                variant: 'form',
                                style: { flex: 1 },
                              })}
                        >
                          {(item) => {
                            return <ComboBox.Item key={item.uri}>{item.label}</ComboBox.Item>
                          }}
                        </ComboBox>
                      ) : (
                        <TextField
                          isReadOnly
                          {...(status === 'deleted'
                            ? {
                                label: propertyValueField.label,
                                variant: 'form-diff',
                                style: { textDecoration: 'line-through 2px' },
                              }
                            : {
                                'aria-label': `${propertyValueField.label} (approved)`,
                                variant: 'form',
                              })}
                          value={propertyValueField.approvedValue}
                        />
                      )
                    ) : null}
                    {/* <HelpText>{propertiesFieldArray.help}</HelpText> */}
                  </div>
                </FormRecord>
              ) : (
                <FormRecord
                  actions={
                    <FormFieldRemoveButton
                      onPress={() => {
                        onRemove()
                        /** YUCK! */
                        if (Array.isArray(props.initialValues?.properties)) {
                          props.initialValues.properties.splice(index, 1)
                        }
                      }}
                      aria-label="Remove property"
                    />
                  }
                >
                  <PropertyTypeSelect
                    name={propertyTypeField.name}
                    label={propertyTypeField.label}
                    propertyTypes={propertyTypes}
                  />
                  <FormFieldCondition
                    name={propertyTypeField.name}
                    condition={(id) => {
                      return (
                        id !== '' &&
                        propertyTypesById[id] !== undefined &&
                        propertyTypesById[id].type === 'concept'
                      )
                    }}
                  >
                    {(id: string) => {
                      return (
                        <Fragment>
                          <PropertyConceptComboBox
                            name={propertyConceptField.name}
                            parentName={name}
                            label={propertyConceptField.label}
                            propertyTypeId={id}
                            propertyType={propertyTypesById[id]}
                            initialValue={props.initialValues?.properties?.[index]?.concept}
                            suggestedConcepts={suggestedConcepts[id]}
                          />
                          {arrayRequiresReview !== true &&
                          propertyTypesById[id].allowedVocabularies?.every((vocab) => {
                            return vocab.closed === false
                          }) === true ? (
                            <button
                              type="button"
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
                    name={propertyTypeField.name}
                    condition={(id) => {
                      return (
                        id !== '' &&
                        propertyTypesById[id] !== undefined &&
                        propertyTypesById[id].type !== 'concept'
                      )
                    }}
                  >
                    {(id: string) => {
                      return (
                        <FormTextField
                          name={propertyValueField.name}
                          label={propertyValueField.label}
                          style={{ flex: 1 }}
                          // @ts-expect-error It's ok
                          helpText={helpText.properties[id]}
                        />
                      )
                    }}
                  </FormFieldCondition>
                </FormRecord>
              )}
            </FormFieldCondition>
          )
        }}
      </DiffFieldArray>

      <SuggestConceptDialog
        isOpen={showSuggestConceptDialog}
        onSuccess={onConceptSuggested}
        onDismiss={closeSuggestConceptDialog}
        propertyType={
          propertyTypeIdForDialog != null ? propertyTypesById[propertyTypeIdForDialog] : undefined
        }
      />
    </Fragment>
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
      {(item) => {
        return <FormSelect.Item key={item.code}>{item.label}</FormSelect.Item>
      }}
    </FormSelect>
  )
}

interface PropertyConceptComboBoxProps {
  name: string
  parentName: string
  label: string
  propertyTypeId?: string
  propertyType?: any
  initialValue?: any
  suggestedConcepts?: Array<ConceptDto>
}

/**
 * Property concept.
 *
 * The form control displays the concept `uri`, but we also need to submit
 * the concept `id` and vocabulary `id`.
 */
function PropertyConceptComboBox(props: PropertyConceptComboBoxProps): JSX.Element {
  /**
   * Populate the input field with the label of the initially selected item (if any),
   * which triggers a search request. The result set should include the initial item.
   *
   * TODO: should the initial value always be included in the combobox options?
   */
  const initialLabel = props.initialValue?.label ?? ''

  const [searchTerm, setSearchTerm] = useState(initialLabel)
  const debouncedSearchTerm = useDebouncedState(searchTerm, 150).trim()
  const concepts = useSearchConcepts(
    {
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

    props.suggestedConcepts?.forEach((concept) => {
      if (concept.uri !== undefined) {
        map[concept.uri] = concept
      }
    })

    return map
  }, [concepts.data, props.suggestedConcepts])

  const vocabLinks = Array.isArray(props.propertyType?.allowedVocabularies)
    ? props.propertyType.allowedVocabularies
        .map((vocab: any) => {
          // TODO: accessibleAt is currently empty for all vocabs, so we use namespace
          if (vocab.namespace == null || vocab.namespace.length === 0) return null

          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          return { href: vocab.namespace, label: vocab.label || vocab.code }
        })
        .filter(Boolean)
    : []

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
          props.propertyTypeId != null ? (
            vocabLinks.length > 0 ? (
              <Fragment>
                {/* @ts-expect-error It's ok */}
                {helpText.properties[props.propertyTypeId]}.
                <div className="text-ui-sm">
                  See{' '}
                  {vocabLinks.map(
                    ({ href, label }: { href: string; label: string }, index: number) => {
                      return (
                        <Fragment key={href}>
                          {index !== 0 ? <span>, </span> : null}
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-750 hover:text-secondary-600"
                          >
                            {label}
                          </a>
                        </Fragment>
                      )
                    },
                  )}
                  .
                </div>
              </Fragment>
            ) : (
              // @ts-expect-error It's ok
              helpText.properties[props.propertyTypeId]
            )
          ) : undefined
        }
      >
        {(item) => {
          return (
            <FormComboBox.Item key={item.uri} textValue={item.label}>
              {item.label}
              {item.uri != null ? (
                <span className="ml-1.5 text-ui-sm text-gray-550">{item.uri}</span>
              ) : null}
            </FormComboBox.Item>
          )
        }}
      </FormComboBox>
      <FormFieldCondition
        name={props.name}
        condition={(id) => {
          return id !== ''
        }}
      >
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
  onSuccess: (addedConcept: ConceptDto, propertyType: PropertyTypeDto) => void
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
        onSuccess(data) {
          queryClient.invalidateQueries(['searchConcepts'])
          queryClient.invalidateQueries(['getAllConceptRelations'])
          queryClient.invalidateQueries(['getVocabulary', { code: vocabularyId }])
          toast.success('Sucessfully suggested concept.')
          props.onSuccess(data, props.propertyType!)
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
      <button onClick={props.onDismiss} className="self-end" aria-label="Close dialog">
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
    <Form onSubmit={onSubmit} validate={onValidate} initialValues={initialValues}>
      {({ handleSubmit, submitting, pristine, invalid }) => {
        return (
          <form
            noValidate
            className="flex flex-col space-y-6"
            onSubmit={(e) => {
              handleSubmit(e)
              e.stopPropagation()
            }}
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
            <FormTextField name="notation" label="Notation" variant="form" style={{ flex: 1 }} />
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
              <Button type="submit" variant="gradient" isDisabled={submitting || isLoading}>
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

    code: camelCase(unsanitizedValues.label!),
  }

  return values
}
