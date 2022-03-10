import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { MediaFormFieldArray } from '@/components/item-form/MediaFormFieldArray'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface MediaFormSectionProps {
  formFields: ItemFormFields
}

export function MediaFormSection(props: MediaFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const { t } = useI18n<'authenticated' | 'common'>()

  return (
    <FormSection>
      <FormSectionTitle>{t(['authenticated', 'forms', 'media-section'])}</FormSectionTitle>
      <MediaFormFieldArray field={fields.media} />
    </FormSection>
  )
}
