import { useTranslations } from 'next-intl'

import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { PropertiesFormFieldArray } from '@/components/item-form/PropertiesFormFieldArray'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'

export interface PropertyFormSectionProps {
  formFields: ItemFormFields
}

export function PropertyFormSection(props: PropertyFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const t = useTranslations('authenticated')

  return (
    <FormSection>
      <FormSectionTitle>{t('forms.properties-section')}</FormSectionTitle>
      <PropertiesFormFieldArray field={fields.properties} />
    </FormSection>
  )
}
