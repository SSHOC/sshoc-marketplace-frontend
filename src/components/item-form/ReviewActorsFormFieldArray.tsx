import { Fragment } from 'react'
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
import { ReviewFieldListItem } from '@/components/item-form/ReviewFieldListItem'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { ItemContributorRef, ItemsDiff } from '@/data/sshoc/api/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { TextField } from '@/lib/core/ui/TextField/TextField'

export interface ReviewActorsFormFieldArrayProps {
  field: ItemFormFields['fields']['contributors']
}

export function ReviewActorsFormFieldArray(props: ReviewActorsFormFieldArrayProps): JSX.Element {
  const { field } = props

  const { t } = useI18n<'authenticated' | 'common'>()
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
              <ReviewFieldListItem<ItemsDiff['item']['contributors'][number]>
                name={name}
                fields={fieldArray.fields}
                index={index}
                review={({ createLabel, status, value }) => {
                  return (
                    <FormFieldGroup>
                      <TextField
                        color={`review ${status}`}
                        isReadOnly
                        label={createLabel(fieldGroup.role.label)}
                        value={value?.role.label}
                      />
                      <TextField
                        color={`review ${status}`}
                        isReadOnly
                        label={createLabel(fieldGroup.actor.label)}
                        value={value?.actor.name}
                      />
                    </FormFieldGroup>
                  )
                }}
              >
                <Fragment>
                  <FormFieldGroup>
                    <ActorRoleSelect field={fieldGroup.role} />
                    <ActorComboBox field={fieldGroup.actor} />
                  </FormFieldGroup>
                  <FormFieldListItemControls>
                    <EditActorButton field={fieldGroup.actor} />
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
