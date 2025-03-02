import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { FormDateField } from '@/lib/core/form/FormDateField'

export interface DateFormSectionProps {
  formFields: ItemFormFields
}

export function DateFormSection(props: DateFormSectionProps): JSX.Element {
  const { category, fields } = props.formFields

  const t = useTranslations('authenticated')

  if (category === 'dataset' || category === 'publication' || category === 'training-material') {
    return (
      <FormSection>
        <FormSectionTitle>{t('forms.date-section')}</FormSectionTitle>
        <FormDateField {...fields.dateCreated} />
        <FormDateField {...fields.dateLastUpdated} />
      </FormSection>
    )
  }

  return <Fragment />
}
