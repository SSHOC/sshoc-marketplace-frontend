import { useTranslations } from 'next-intl'
import { useFieldArray } from 'react-final-form-arrays'

import { FormFieldArray } from '@/components/common/FormFieldArray'
import { FormFieldArrayControls } from '@/components/common/FormFieldArrayControls'
import { FormFieldList } from '@/components/common/FormFieldList'
import { FormFieldListItem } from '@/components/common/FormFieldListItem'
import { FormFieldListItemControls } from '@/components/common/FormFieldListItemControls'
import { FormRecordAddButton } from '@/components/common/FormRecordAddButton'
import { FormRecordRemoveButton } from '@/components/common/FormRecordRemoveButton'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { FormTextField } from '@/lib/core/form/FormTextField'

export interface AccessibleAtFormFieldArrayProps {
  field: ItemFormFields['fields']['accessibleAt']
}

export function AccessibleAtFormFieldArray(props: AccessibleAtFormFieldArrayProps): JSX.Element {
  const { field } = props

  const t = useTranslations('authenticated')
  const fieldArray = useFieldArray<string | undefined>(field.name, { subscription: {} })

  function onAdd() {
    fieldArray.fields.push(undefined)
  }

  return (
    <FormFieldArray>
      <FormFieldList key={fieldArray.fields.length}>
        {fieldArray.fields.map((name, index) => {
          function onRemove() {
            fieldArray.fields.remove(index)
          }

          return (
            <FormFieldListItem key={name}>
              <FormTextField {...field} name={name} />
              <FormFieldListItemControls>
                <FormRecordRemoveButton
                  aria-label={t('forms.remove-field', {
                    field: field.itemLabel,
                  })}
                  onPress={onRemove}
                >
                  {t('controls.delete')}
                </FormRecordRemoveButton>
              </FormFieldListItemControls>
            </FormFieldListItem>
          )
        })}
      </FormFieldList>
      <FormFieldArrayControls>
        <FormRecordAddButton onPress={onAdd}>
          {t('forms.add-field', {
            field: field.itemLabel,
          })}
        </FormRecordAddButton>
      </FormFieldArrayControls>
    </FormFieldArray>
  )
}
