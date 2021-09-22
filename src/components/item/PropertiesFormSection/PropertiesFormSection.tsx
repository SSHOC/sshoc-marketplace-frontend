import { Fragment, useMemo, useState } from 'react'
import type { QueryObserverResult } from 'react-query'

import type {
  PaginatedPropertyTypes,
  PropertyTypeDto,
  SearchConcept,
} from '@/api/sshoc'
import { useGetPropertyTypes, useSearchConcepts } from '@/api/sshoc'
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
                            <PropertyConceptSelect
                              name={`${name}.concept.uri`}
                              parentName={name}
                              label={'Concept'}
                              propertyTypeId={id}
                              initialValues={props.initialValues}
                              index={index}
                            />
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

interface PropertyConceptSelectProps {
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
function PropertyConceptSelect(props: PropertyConceptSelectProps): JSX.Element {
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
