import get from 'lodash.get'
import { Fragment, useEffect, useState } from 'react'

import type { ItemsDifferencesDto } from '@/api/sshoc'
import { useGetItemRelations, useSearchItems } from '@/api/sshoc'
import { ComboBox } from '@/elements/ComboBox/ComboBox'
import { HelpText } from '@/elements/HelpText/HelpText'
import { Select } from '@/elements/Select/Select'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { DiffControls } from '@/modules/form/diff/DiffControls'
import { DiffFieldArray } from '@/modules/form/diff/DiffFieldArray'
import helpText from '@@/config/form-helptext.json'

export interface RelatedItemsFormSectionProps {
  initialValues?: any
  prefix?: string
  diff?: ItemsDifferencesDto
}

/**
 * Form section for related items.
 */
export function RelatedItemsFormSection(
  props: RelatedItemsFormSectionProps,
): JSX.Element {
  const prefix = props.prefix ?? ''
  const isDiffingEnabled = props.diff != null && props.diff.equal === false
  const diff = props.diff ?? {}

  const relatedItemsFieldArray = {
    name: `${prefix}relatedItems`,
    label: 'Related items',
    approvedValue: get(diff.item, `${prefix}relatedItems`),
    suggestedValue: get(diff.other, `${prefix}relatedItems`),
    help: helpText.relatedItem,
  }

  return (
    <DiffFieldArray
      name={relatedItemsFieldArray.name}
      approvedValue={relatedItemsFieldArray.approvedValue}
      suggestedValue={relatedItemsFieldArray.suggestedValue}
      actions={({ onAdd, arrayRequiresReview }) => {
        if (arrayRequiresReview === true) return null

        return (
          <FormFieldAddButton onPress={() => onAdd()}>
            Add related item
          </FormFieldAddButton>
        )
      }}
      isEnabled={isDiffingEnabled}
      wrapper={({ children }) => {
        return (
          <FormSection title={relatedItemsFieldArray.label}>
            {children}
          </FormSection>
        )
      }}
    >
      {({
        name,
        index,
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

        const relationTypeField = {
          name: `${name}.relation.code`,
          label: 'Relation type',
          approvedValue: get(approvedValue, 'relation.code'),
          approvedItem: get(approvedValue, 'relation'),
          suggestedValue: get(suggestedValue, 'relation.code'),
          suggestedItem: get(suggestedValue, 'relation'),
        }

        const relatedItemField = {
          name: `${name}.persistentId`,
          label: 'Item',
          approvedValue: get(approvedValue, 'persistentId'),
          approvedItem: approvedValue as any,
          suggestedValue: get(suggestedValue, 'persistentId'),
          suggestedItem: suggestedValue as any,
        }

        return (
          <Fragment>
            {requiresReview ? (
              <FormRecord
                className="py-2"
                actions={
                  <DiffControls
                    status={status}
                    onApprove={onApprove}
                    onReject={() => {
                      /** YUCK! */
                      if (index < props.initialValues.relatedItems.length) {
                        props.initialValues.relatedItems[index] = approvedValue
                      }
                      onReject()
                    }}
                  />
                }
              >
                <div className="grid content-start gap-1">
                  <Select
                    label={relationTypeField.label}
                    isReadOnly
                    variant="form-diff"
                    selectedKey={relationTypeField.suggestedValue}
                    items={[relationTypeField.suggestedItem]}
                  >
                    {(item) => {
                      return (
                        <Select.Item key={item.code}>{item.label}</Select.Item>
                      )
                    }}
                  </Select>
                  <Select
                    aria-label={`${relationTypeField.label} (approved)`}
                    isReadOnly
                    variant="form"
                    selectedKey={relationTypeField.approvedValue}
                    items={[relationTypeField.approvedItem]}
                  >
                    {(item) => {
                      return (
                        <Select.Item key={item.code}>{item.label}</Select.Item>
                      )
                    }}
                  </Select>
                </div>
                <div className="grid content-start flex-1 gap-1">
                  <ComboBox
                    label={relatedItemField.label}
                    isReadOnly
                    variant="form-diff"
                    selectedKey={relatedItemField.suggestedValue}
                    items={[relatedItemField.suggestedItem]}
                    style={{ flex: 1 }}
                  >
                    {(item) => {
                      return (
                        <ComboBox.Item key={item.persistentId}>
                          {item.label}
                        </ComboBox.Item>
                      )
                    }}
                  </ComboBox>
                  <ComboBox
                    aria-label={`${relatedItemField.label} (approved)`}
                    isReadOnly
                    variant="form"
                    selectedKey={relatedItemField.approvedValue}
                    items={[relatedItemField.approvedItem]}
                    style={{ flex: 1 }}
                  >
                    {(item) => {
                      return (
                        <ComboBox.Item key={item.persistentId}>
                          {item.label}
                        </ComboBox.Item>
                      )
                    }}
                  </ComboBox>
                  <HelpText>{relatedItemsFieldArray.help}</HelpText>
                </div>
              </FormRecord>
            ) : (
              <FormRecord
                actions={
                  arrayRequiresReview === true ? null : (
                    <FormFieldRemoveButton
                      onPress={() => {
                        onRemove()
                        /** YUCK! */
                        if (Array.isArray(props.initialValues?.relatedItems)) {
                          props.initialValues.relatedItems.splice(index, 1)
                          // doRefresh((i) => i + 1)
                        }
                      }}
                      aria-label="Remove related item"
                    />
                  )
                }
              >
                <RelationTypeSelect
                  name={relationTypeField.name}
                  label={relationTypeField.label}
                />
                <RelatedItemComboBox
                  // key={refresh}
                  name={relatedItemField.name}
                  label={relatedItemField.label}
                  initialValue={props.initialValues?.relatedItems?.[index]}
                />
              </FormRecord>
            )}
          </Fragment>
        )
      }}
    </DiffFieldArray>
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
  initialValue?: any
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
  const initialLabel = props.initialValue?.label ?? ''

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
