import { useTranslations } from 'next-intl'
import { useFieldArray } from 'react-final-form-arrays'

import { ActorComboBox } from '@/components/common/ActorComboBox'
import { FormFieldArray } from '@/components/common/FormFieldArray'
import { FormFieldArrayControls } from '@/components/common/FormFieldArrayControls'
import { FormFieldGroup } from '@/components/common/FormFieldGroup'
import { FormFieldList } from '@/components/common/FormFieldList'
import { FormFieldListItem } from '@/components/common/FormFieldListItem'
import { FormFieldListItemControls } from '@/components/common/FormFieldListItemControls'
import { FormRecordAddButton } from '@/components/common/FormRecordAddButton'
import { FormRecordRemoveButton } from '@/components/common/FormRecordRemoveButton'
import { ActorRoleSelect } from '@/components/item-form/ActorRoleSelect'
import { EditActorButton } from '@/components/item-form/EditActorButton'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { ItemContributorRef } from '@/data/sshoc/api/item'

export interface ActorsFormFieldArrayProps {
  field: ItemFormFields['fields']['contributors']
}

export function ActorsFormFieldArray(props: ActorsFormFieldArrayProps): JSX.Element {
  const { field } = props

  const t = useTranslations('authenticated')
  const fieldArray = useFieldArray<ItemContributorRef | UndefinedLeaves<ItemContributorRef>>(
    field.name,
    { subscription: {} },
  )

  function onAdd() {
    fieldArray.fields.push({ role: { code: undefined }, actor: { id: undefined } })
  }

  return (
    <FormFieldArray>
      <FormFieldList key={fieldArray.fields.length}>
        {fieldArray.fields.map((name, index) => {
          function onRemove() {
            fieldArray.fields.remove(index)
          }

          const fieldGroup = {
            role: {
              ...field.fields.role,
              name: [name, field.fields.role.name].join('.'),
              _root: [name, field.fields.role._root].join('.'),
            },
            actor: {
              ...field.fields.actor,
              name: [name, field.fields.actor.name].join('.'),
              _root: [name, field.fields.actor._root].join('.'),
            },
          }

          return (
            <FormFieldListItem key={name}>
              <FormFieldGroup>
                <ActorRoleSelect field={fieldGroup.role} />
                <ActorComboBox field={fieldGroup.actor} />
              </FormFieldGroup>
              <FormFieldListItemControls>
                <EditActorButton field={fieldGroup.actor} />
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
