import { useTranslations } from 'next-intl'

import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { ReviewThumbnailFormField } from '@/components/item-form/ReviewThumbnailFormField'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'

export interface ThumbnailReviewFormSectionProps {
  formFields: ItemFormFields
}

export function ThumbnailReviewFormSection(props: ThumbnailReviewFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const t = useTranslations('authenticated')

  return (
    <FormSection>
      <FormSectionTitle>{t('forms.thumbnail-section')}</FormSectionTitle>
      <ReviewThumbnailFormField field={fields.thumbnail} />
    </FormSection>
  )
}
