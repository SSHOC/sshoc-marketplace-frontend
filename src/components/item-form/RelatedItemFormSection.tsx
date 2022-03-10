import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { RelatedItemsFormFieldArray } from '@/components/item-form/RelatedItemsFormFieldArray'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface RelatedItemFormSectionProps {
  formFields: ItemFormFields
}

export function RelatedItemFormSection(props: RelatedItemFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const { t } = useI18n<'authenticated' | 'common'>()

  return (
    <FormSection>
      <FormSectionTitle>{t(['authenticated', 'forms', 'related-items-section'])}</FormSectionTitle>
      <RelatedItemsFormFieldArray field={fields.relatedItems} />
    </FormSection>
  )
}
