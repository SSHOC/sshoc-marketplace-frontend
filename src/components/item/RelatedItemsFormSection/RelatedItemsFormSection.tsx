import { useState } from 'react'

import { useGetAllItemRelations, useSearchItems } from '@/api/sshoc'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { FormFieldArray } from '@/modules/form/FormFieldArray'

export interface RelatedItemsFormSectionProps {
  initialValues?: any
}

/**
 * Form section for related items.
 */
export function RelatedItemsFormSection(
  props: RelatedItemsFormSectionProps,
): JSX.Element {
  return (
    <FormSection title={'Related items'}>
      <FormFieldArray name="relatedItems">
        {({ fields }) => {
          return (
            <FormRecords>
              {fields.map((name, index) => {
                return (
                  <FormRecord key={name}>
                    <RelationTypeSelect
                      name={`${name}.relation.code`}
                      label={'Relation type'}
                    />
                    <RelatedItemComboBox
                      name={`${name}.objectId`}
                      label={'Item'}
                    />
                    <FormFieldRemoveButton
                      onPress={() => fields.remove(index)}
                      aria-label={'Remove related item'}
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
  const relationTypes = useGetAllItemRelations()

  return (
    <FormSelect
      name={props.name}
      label={props.label}
      items={relationTypes.data ?? []}
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
}

/**
 * Related item.
 */
function RelatedItemComboBox(props: RelatedItemComboBoxProps): JSX.Element {
  // const itemCategories = useGetItemCategories()
  // const [category, setCategory] = useState<ItemCategory | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
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

  return (
    <FormComboBox
      name={props.name}
      label={props.label}
      items={searchResults.data?.items ?? []}
      isLoading={searchResults.isLoading}
      onInputChange={setSearchTerm}
      variant="form"
      style={{ flex: 1 }}
    >
      {(item) => (
        <FormComboBox.Item key={item.persistentId}>
          {item.label}
        </FormComboBox.Item>
      )}
    </FormComboBox>
  )
}
