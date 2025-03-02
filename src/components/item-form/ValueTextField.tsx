import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { PropertyType } from '@/data/sshoc/api/property'
import { FormTextField } from '@/lib/core/form/FormTextField'

export interface ValueTextFieldProps {
  field: ItemFormFields['fields']['properties']['fields']['value']
  propertyTypeId: PropertyType['code']
}

export function ValueTextField(props: ValueTextFieldProps): JSX.Element {
  const { field, propertyTypeId } = props

  const t = useTranslations('authenticated')

  const description = (
    <Fragment>
      <span>{field.description}</span>
      {/* @ts-expect-error Assume all possible property types have translation. */}
      <span>{t(`properties.${propertyTypeId}.description`)}</span>
    </Fragment>
  )

  return <FormTextField {...field} description={description} />
}
