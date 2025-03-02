import { useTranslations } from 'next-intl'

import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { ThumbnailFormField } from '@/components/item-form/ThumbnailFormField'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'

export interface ThumbnailFormSectionProps {
  formFields: ItemFormFields
}

export function ThumbnailFormSection(props: ThumbnailFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const t = useTranslations('authenticated')

  return (
    <FormSection>
      <FormSectionTitle>{t('forms.thumbnail-section')}</FormSectionTitle>
      <ThumbnailFormField field={fields.thumbnail} />
    </FormSection>
  )
}
