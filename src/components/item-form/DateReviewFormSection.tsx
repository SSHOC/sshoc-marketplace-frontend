import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { ReviewField } from '@/components/item-form/ReviewField'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { ItemsDiff } from '@/data/sshoc/api/item'
import { FormDateField } from '@/lib/core/form/FormDateField'
import { DateField } from '@/lib/core/ui/DateField/DateField'

export interface DateReviewFormSectionProps {
  formFields: ItemFormFields
}

export function DateReviewFormSection(props: DateReviewFormSectionProps): JSX.Element {
  const { category, fields } = props.formFields

  const t = useTranslations('authenticated')

  if (category === 'dataset' || category === 'publication' || category === 'training-material') {
    return (
      <FormSection>
        <FormSectionTitle>{t('forms.date-section')}</FormSectionTitle>

        <ReviewField<ItemsDiff['item']['dateCreated']>
          name={fields.label.name}
          review={({ createLabel, status, value }) => {
            return (
              <DateField
                color={`review ${status}`}
                isReadOnly
                label={createLabel(fields.dateCreated.label)}
                value={value}
              />
            )
          }}
        >
          <FormDateField {...fields.dateCreated} />
        </ReviewField>

        <ReviewField<ItemsDiff['item']['dateLastUpdated']>
          name={fields.label.name}
          review={({ createLabel, status, value }) => {
            return (
              <DateField
                color={`review ${status}`}
                isReadOnly
                label={createLabel(fields.dateLastUpdated.label)}
                value={value}
              />
            )
          }}
        >
          <FormDateField {...fields.dateLastUpdated} />
        </ReviewField>
      </FormSection>
    )
  }

  return <Fragment />
}
