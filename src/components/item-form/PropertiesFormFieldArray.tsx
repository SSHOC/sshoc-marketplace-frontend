import type { ReactNode } from 'react'
import { Fragment, useMemo } from 'react'
import { useFieldArray } from 'react-final-form-arrays'

import { FormFieldArray } from '@/components/common/FormFieldArray'
import { FormFieldArrayControls } from '@/components/common/FormFieldArrayControls'
import { FormFieldGroup } from '@/components/common/FormFieldGroup'
import { FormFieldList } from '@/components/common/FormFieldList'
import { FormFieldListItem } from '@/components/common/FormFieldListItem'
import { FormFieldListItemControls } from '@/components/common/FormFieldListItemControls'
import { FormRecordAddButton } from '@/components/common/FormRecordAddButton'
import { FormRecordRemoveButton } from '@/components/common/FormRecordRemoveButton'
import { CreateConceptButton } from '@/components/item-form/CreateConceptButton'
import { ItemProperty } from '@/components/item-form/ItemProperty'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { PropertyInput, PropertyType } from '@/data/sshoc/api/property'
import { usePropertyTypes } from '@/data/sshoc/hooks/property'
import { usePublishPermission } from '@/data/sshoc/utils/usePublishPermission'
import { useFieldState } from '@/lib/core/form/useFieldState'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { mapBy } from '@/lib/utils'

export interface PropertiesFormFieldArrayProps {
  field: ItemFormFields['fields']['properties']
}

export function PropertiesFormFieldArray(props: PropertiesFormFieldArrayProps): JSX.Element {
  const { field } = props

  const { t, createCollator } = useI18n<'authenticated' | 'common'>()
  const compare = createCollator()
  const fieldArray = useFieldArray<PropertyInput | UndefinedLeaves<PropertyInput>>(field.name, {
    subscription: {},
  })

  function onAdd() {
    fieldArray.fields.push({
      type: { code: undefined, type: undefined },
      // value: undefined,
      concept: { uri: undefined },
    })
  }

  const propertyTypes = usePropertyTypes({ perpage: 100 }, undefined, {
    select(data) {
      data.propertyTypes.sort((a, b) => {
        return compare(a.label, b.label)
      })

      return data
    },
  })
  const propertyTypesMap = useMemo(() => {
    if (propertyTypes.data == null) {return new Map<PropertyType['code'], PropertyType>()}
    return mapBy(propertyTypes.data.propertyTypes, 'code')
  }, [propertyTypes.data])

  return (
    <FormFieldArray>
      <FormFieldList key={fieldArray.fields.length}>
        {fieldArray.fields.map((name, index) => {
          function onRemove() {
            fieldArray.fields.remove(index)
          }

          const fieldGroup = {
            type: {
              ...field.fields.type,
              name: [name, field.fields.type.name].join('.'),
              _root: [name, field.fields.type._root].join('.'),
            },
            value: {
              ...field.fields.value,
              name: [name, field.fields.value.name].join('.'),
            },
            concept: {
              ...field.fields.concept,
              name: [name, field.fields.concept.name].join('.'),
              _root: [name, field.fields.concept._root].join('.'),
            },
          }

          return (
            <ItemPropertyAccessControl
              key={name}
              name={fieldGroup.type.name}
              propertyTypesMap={propertyTypesMap}
            >
              <FormFieldListItem>
                <FormFieldGroup>
                  <ItemProperty
                    fieldGroup={fieldGroup}
                    propertyTypes={propertyTypes}
                    propertyTypesMap={propertyTypesMap}
                  />
                </FormFieldGroup>
                <FormFieldListItemControls>
                  <CreateConceptButton
                    fieldGroup={fieldGroup}
                    propertyTypesMap={propertyTypesMap}
                  />
                  <FormRecordRemoveButton
                    aria-label={t(['authenticated', 'forms', 'remove-field'], {
                      values: { field: field.itemLabel },
                    })}
                    onPress={onRemove}
                  >
                    {t(['authenticated', 'controls', 'delete'])}
                  </FormRecordRemoveButton>
                </FormFieldListItemControls>
              </FormFieldListItem>
            </ItemPropertyAccessControl>
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

interface ItemPropertyAccessControlProps {
  children?: ReactNode
  name: string
  propertyTypesMap: Map<PropertyType['code'], PropertyType>
}

function ItemPropertyAccessControl(props: ItemPropertyAccessControlProps): JSX.Element | null {
  const { children, name, propertyTypesMap } = props

  const hasPublishPermission = usePublishPermission()

  const propertyTypeId = useFieldState<PropertyType['code'] | undefined>(name).input.value
  const propertyType = propertyTypeId != null ? propertyTypesMap.get(propertyTypeId) : null
  const isHidden = propertyType?.hidden === true

  if (isHidden && !hasPublishPermission) {
    return null
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment>{children}</Fragment>
}
