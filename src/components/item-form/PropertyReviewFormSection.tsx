import { useTranslations } from 'next-intl'

import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { ReviewPropertiesFormFieldArray } from '@/components/item-form/ReviewPropertiesFormFieldArray'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'

export interface PropertyReviewFormSectionProps {
  formFields: ItemFormFields
}

export function PropertyReviewFormSection(props: PropertyReviewFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const t = useTranslations('authenticated')

  return (
    <FormSection>
      <FormSectionTitle>{t('forms.properties-section')}</FormSectionTitle>
      <ReviewPropertiesFormFieldArray field={fields.properties} />
    </FormSection>
  )
}
