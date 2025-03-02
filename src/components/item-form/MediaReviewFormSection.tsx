import { useTranslations } from 'next-intl'

import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { ReviewMediaFormFieldArray } from '@/components/item-form/ReviewMediaFormFieldArray'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'

export interface MediaReviewFormSectionProps {
  formFields: ItemFormFields
}

export function MediaReviewFormSection(props: MediaReviewFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const t = useTranslations('authenticated')

  return (
    <FormSection>
      <FormSectionTitle>{t('forms.media-section')}</FormSectionTitle>
      <ReviewMediaFormFieldArray field={fields.media} />
    </FormSection>
  )
}
