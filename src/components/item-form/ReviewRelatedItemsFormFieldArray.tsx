import { Fragment } from 'react'
import { useFieldArray } from 'react-final-form-arrays'

import { FormFieldArray } from '@/components/common/FormFieldArray'
import { FormFieldArrayControls } from '@/components/common/FormFieldArrayControls'
import { FormFieldGroup } from '@/components/common/FormFieldGroup'
import { FormFieldList } from '@/components/common/FormFieldList'
import { FormFieldListItem } from '@/components/common/FormFieldListItem'
import { FormFieldListItemControls } from '@/components/common/FormFieldListItemControls'
import { FormRecordAddButton } from '@/components/common/FormRecordAddButton'
import { FormRecordRemoveButton } from '@/components/common/FormRecordRemoveButton'
import { ItemRelationSelect } from '@/components/item-form/ItemRelationSelect'
import { RelatedItemComboBox } from '@/components/item-form/RelatedItemComboBox'
import { ReviewFieldListItem } from '@/components/item-form/ReviewFieldListItem'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { ItemsDiff, RelatedItemInput } from '@/data/sshoc/api/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { TextField } from '@/lib/core/ui/TextField/TextField'

export interface ReviewRelatedItemsFormFieldArrayProps {
  field: ItemFormFields['fields']['relatedItems']
}

export function ReviewRelatedItemsFormFieldArray(
  props: ReviewRelatedItemsFormFieldArrayProps,
): JSX.Element {
  const { field } = props

  const { t } = useI18n<'authenticated' | 'common'>()
  const fieldArray = useFieldArray<RelatedItemInput | UndefinedLeaves<RelatedItemInput>>(
    field.name,
    { subscription: {} },
  )

  function onAdd() {
    fieldArray.fields.push({ relation: { code: undefined }, persistentId: undefined })
  }

  return (
    <FormFieldArray>
      <FormFieldList key={fieldArray.fields.length}>
        {fieldArray.fields.map((name, index) => {
          function onRemove() {
            fieldArray.fields.remove(index)
          }

          const fieldGroup = {
            relation: {
              ...field.fields.relation,
              name: [name, field.fields.relation.name].join('.'),
              _root: [name, field.fields.relation._root].join('.'),
            },
            item: {
              ...field.fields.item,
              name: [name, field.fields.item.name].join('.'),
              _root: name,
            },
          }

          return (
            <FormFieldListItem key={name}>
              <ReviewFieldListItem<ItemsDiff['item']['relatedItems'][number]>
                name={name}
                fields={fieldArray.fields}
                index={index}
                review={({ createLabel, status, value }) => {
                  return (
                    <FormFieldGroup>
                      <TextField
                        color={`review ${status}`}
                        isReadOnly
                        label={createLabel(fieldGroup.relation.label)}
                        value={value?.relation.label}
                      />
                      <TextField
                        color={`review ${status}`}
                        isReadOnly
                        label={createLabel(fieldGroup.item.label)}
                        value={value?.label}
                      />
                    </FormFieldGroup>
                  )
                }}
              >
                <Fragment>
                  <FormFieldGroup>
                    <ItemRelationSelect field={fieldGroup.relation} />
                    <RelatedItemComboBox field={fieldGroup.item} />
                  </FormFieldGroup>
                  <FormFieldListItemControls>
                    <FormRecordRemoveButton
                      aria-label={t(['authenticated', 'forms', 'remove-field'], {
                        values: { field: field.itemLabel },
                      })}
                      onPress={onRemove}
                    >
                      {t(['authenticated', 'controls', 'delete'])}
                    </FormRecordRemoveButton>
                  </FormFieldListItemControls>
                </Fragment>
              </ReviewFieldListItem>
            </FormFieldListItem>
          )
        })}
      </FormFieldList>
      <FormFieldArrayControls>
        <FormRecordAddButton onPress={onAdd}>
          {t(['authenticated', 'forms', 'add-field'], {
            values: { field: field.itemLabel },
          })}
        </FormRecordAddButton>
      </FormFieldArrayControls>
    </FormFieldArray>
  )
}
