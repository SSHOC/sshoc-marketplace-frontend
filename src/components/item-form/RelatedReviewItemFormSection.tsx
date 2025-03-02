import { useTranslations } from 'next-intl'

import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { ReviewRelatedItemsFormFieldArray } from '@/components/item-form/ReviewRelatedItemsFormFieldArray'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'

export interface RelatedReviewItemFormSectionProps {
  formFields: ItemFormFields
}

export function RelatedReviewItemFormSection(
  props: RelatedReviewItemFormSectionProps,
): JSX.Element {
  const { fields } = props.formFields

  const t = useTranslations('authenticated')

  return (
    <FormSection>
      <FormSectionTitle>{t('forms.related-items-section')}</FormSectionTitle>
      <ReviewRelatedItemsFormFieldArray field={fields.relatedItems} />
    </FormSection>
  )
}
