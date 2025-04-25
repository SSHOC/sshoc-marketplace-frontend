import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { FormDateField } from '@/lib/core/form/FormDateField'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface DateFormSectionProps {
  formFields: ItemFormFields
}

export function DateFormSection(props: DateFormSectionProps): JSX.Element | null {
  const { category, fields } = props.formFields

  const { t } = useI18n<'authenticated' | 'common'>()

  if (category === 'dataset' || category === 'publication' || category === 'training-material') {
    return (
      <FormSection>
        <FormSectionTitle>{t(['authenticated', 'forms', 'date-section'])}</FormSectionTitle>
        <FormDateField {...fields.dateCreated} />
        <FormDateField {...fields.dateLastUpdated} />
      </FormSection>
    )
  }

  return null
}
