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
import { FormFieldArray } from '@/modules/form/FormFieldArray'
import helpText from '@@/config/form-helptext.json'

export interface RelatedItemsFormSectionProps {
  initialValues?: any
  prefix?: string
}

/**
 * Form section for related items.
 */
export function RelatedItemsFormSection(
  props: RelatedItemsFormSectionProps,
): JSX.Element {
  const prefix = props.prefix ?? ''

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
                    <RelationTypeSelect
                      name={`${name}.relation.code`}
                      label={'Relation type'}
                    />
                    <RelatedItemComboBox
                      name={`${name}.persistentId`}
                      label={'Item'}
                      initialValues={props.initialValues}
                      index={index}
                    />
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
}

/**
 * Relation type.
 */
function RelationTypeSelect(props: RelationTypeSelectProps): JSX.Element {
  // TODO: will we ever have more than 100 relation types? if yes, make this a combobox.
  const relationTypes = useGetItemRelations({ perpage: 100 })

  const types = relationTypes.data?.itemRelations ?? []

  return (
    <FormSelect
      name={props.name}
      label={props.label}
      items={types}
      isLoading={relationTypes.isLoading}
      variant="form"
    >
      {(item) => (
        <FormSelect.Item key={item.code}>{item.label}</FormSelect.Item>
      )}
    </FormSelect>
  )
}

interface RelatedItemComboBoxProps {
  name: string
  label: string
  initialValues?: any
  index: number
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
    <FormComboBox
      name={props.name}
      label={props.label}
      items={searchResults.data?.items ?? []}
      isLoading={searchResults.isLoading}
      onInputChange={setSearchTerm}
      variant="form"
      style={{ flex: 1 }}
      helpText={helpText.relatedItem}
    >
      {(item) => (
        <FormComboBox.Item key={item.persistentId}>
          {item.label}
        </FormComboBox.Item>
      )}
    </FormComboBox>
  )
}
