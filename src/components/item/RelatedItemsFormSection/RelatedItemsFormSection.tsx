import get from 'lodash.get'
import { useEffect, useState } from 'react'

import { useGetItemRelations, useSearchItems } from '@/api/sshoc'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { DiffField } from '@/modules/form/diff/DiffField'
import { DiffFormComboBox } from '@/modules/form/diff/DiffFormComboBox'
import { DiffFormSelect } from '@/modules/form/diff/DiffFormSelect'
import { FormFieldArray } from '@/modules/form/FormFieldArray'
import helpText from '@@/config/form-helptext.json'

export interface RelatedItemsFormSectionProps {
  initialValues?: any
  prefix?: string
  diff?: any
}

/**
 * Form section for related items.
 */
export function RelatedItemsFormSection(
  props: RelatedItemsFormSectionProps,
): JSX.Element {
  const prefix = props.prefix ?? ''
  const diff = props.diff ?? {}

  return (
    <FormSection title={'Related items'}>
      <FormFieldArray name={`${prefix}relatedItems`}>
        {({ fields }) => {
          return (
            <FormRecords>
              {fields.map((name, index) => {
                return (
                  <FormRecord
                    key={name}
                    actions={
                      <FormFieldRemoveButton
                        onPress={() => {
                          fields.remove(index)
                          /** YUCK! */
                          if (
                            Array.isArray(props.initialValues?.relatedItems)
                          ) {
                            props.initialValues.relatedItems.splice(index, 1)
                          }
                        }}
                        aria-label={'Remove related item'}
                      />
                    }
                  >
                    <DiffField
                      name={name}
                      approvedValue={get(diff.item, name)}
                      suggestedValue={get(diff.other, name)}
                      isArrayField
                    >
                      <RelationTypeSelect
                        name={`${name}.relation.code`}
                        label={'Relation type'}
                        approvedKey={get(diff.item, `${name}.relation.code`)}
                        approvedItem={get(diff.item, `${name}.relation`)}
                      />
                      <RelatedItemComboBox
                        name={`${name}.persistentId`}
                        label={'Item'}
                        initialValues={props.initialValues}
                        index={index}
                        approvedKey={get(diff.item, `${name}.persistentId`)}
                        approvedItem={get(diff.item, `${name}`)}
                      />
                    </DiffField>
                  </FormRecord>
                )
              })}
              {/* Items might have been deleted so the array will be shorter than in the approved version. */}
              {get(diff.item, `${prefix}relatedItems`)
                .slice(fields.length)
                .map((field: string, _index: number) => {
                  const index = (fields.length ?? 0) + _index
                  const name = `${prefix}relatedItems.${index}`

                  return (
                    <FormRecord key={name}>
                      <DiffField
                        name={name}
                        approvedValue={get(diff.item, name)}
                        suggestedValue={get(diff.other, name)}
                        isArrayField
                      >
                        <RelationTypeSelect
                          name={`${name}.relation.code`}
                          label={'Relation type'}
                          approvedKey={get(diff.item, `${name}.relation.code`)}
                          approvedItem={get(diff.item, `${name}.relation`)}
                        />
                        <RelatedItemComboBox
                          name={`${name}.persistentId`}
                          label={'Item'}
                          initialValues={props.initialValues}
                          index={index}
                          approvedKey={get(diff.item, `${name}.persistentId`)}
                          approvedItem={get(diff.item, `${name}`)}
                        />
                      </DiffField>
                    </FormRecord>
                  )
                })}
              <FormFieldAddButton onPress={() => fields.push(undefined)}>
                {'Add related item'}
              </FormFieldAddButton>
            </FormRecords>
          )
        }}
      </FormFieldArray>
    </FormSection>
  )
}

interface RelationTypeSelectProps {
  name: string
  label: string
  approvedKey?: string | undefined
  approvedItem?: any | undefined
}

/**
 * Relation type.
 */
function RelationTypeSelect(props: RelationTypeSelectProps): JSX.Element {
  // TODO: will we ever have more than 100 relation types? if yes, make this a combobox.
  const relationTypes = useGetItemRelations({ perpage: 100 })

  const types = relationTypes.data?.itemRelations ?? []

  return (
    <DiffFormSelect
      name={props.name}
      label={props.label}
      items={types}
      isLoading={relationTypes.isLoading}
      variant="form"
      approvedKey={props.approvedKey}
      approvedItem={props.approvedItem}
    >
      {(item) => (
        <FormSelect.Item key={item.code}>{item.label}</FormSelect.Item>
      )}
    </DiffFormSelect>
  )
}

interface RelatedItemComboBoxProps {
  name: string
  label: string
  initialValues?: any
  index: number
  approvedKey?: string | undefined
  approvedItem?: any | undefined
}

/**
 * Related item.
 */
function RelatedItemComboBox(props: RelatedItemComboBoxProps): JSX.Element {
  /**
   * Populate the input field with the label of the initially selected item (if any),
   * which triggers a search request. The result set should include the initial item.
   *
   * TODO: should the initial value always be included in the combobox options?
   */
  const initialLabel =
    props.initialValues?.relatedItems?.[props.index]?.label ?? ''

  // const itemCategories = useGetItemCategories()
  // const [category, setCategory] = useState<ItemCategory | null>(null)

  const [searchTerm, setSearchTerm] = useState(initialLabel)
  const debouncedSearchTerm = useDebouncedState(searchTerm, 150).trim()
  const searchResults = useSearchItems(
    {
      q: debouncedSearchTerm,
      includeSteps: true,
      // categories: category !== null ? [category] : undefined,
    },
    {
      // enabled: debouncedSearchTerm.length > 2,
      keepPreviousData: true,
    },
  )

  useEffect(() => {
    setSearchTerm(initialLabel)
  }, [initialLabel])

  return (
    <DiffFormComboBox
      name={props.name}
      label={props.label}
      items={searchResults.data?.items ?? []}
      isLoading={searchResults.isLoading}
      onInputChange={setSearchTerm}
      variant="form"
      style={{ flex: 1 }}
      helpText={helpText.relatedItem}
      approvedKey={props.approvedKey}
      approvedItem={props.approvedItem}
    >
      {(item) => (
        <FormComboBox.Item key={item.persistentId}>
          {item.label}
        </FormComboBox.Item>
      )}
    </DiffFormComboBox>
  )
}
