import { VisuallyHidden } from '@react-aria/visually-hidden'

import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { ReviewAccessibleAtFormFieldArray } from '@/components/item-form/ReviewAccessibleAtFormFieldArray'
import { ReviewExternalIdsFormFieldArray } from '@/components/item-form/ReviewExternalIdsFormFieldArray'
import { ReviewField } from '@/components/item-form/ReviewField'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { ItemsDiff } from '@/data/sshoc/api/item'
import { FormTextArea } from '@/lib/core/form/FormTextArea'
import { FormTextField } from '@/lib/core/form/FormTextField'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { TextArea } from '@/lib/core/ui/TextField/TextArea'
import { TextField } from '@/lib/core/ui/TextField/TextField'

export interface MainReviewFormSectionProps {
  formFields: ItemFormFields
}

export function MainReviewFormSection(props: MainReviewFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const { t } = useI18n<'authenticated' | 'common'>()

  return (
    <FormSection>
      <VisuallyHidden>
        <FormSectionTitle>{t(['authenticated', 'forms', 'main-section'])}</FormSectionTitle>
      </VisuallyHidden>

      <ReviewField<ItemsDiff['item']['label']>
        name={fields.label.name}
        // eslint-disable-next-line react/no-unstable-nested-components
        review={({ createLabel, status, value }) => {
          return (
            <TextField
              color={`review ${status}`}
              isReadOnly
              isRequired
              label={createLabel(fields.label.label)}
              value={value}
            />
          )
        }}
      >
        <FormTextField {...fields.label} />
      </ReviewField>

      <ReviewField<ItemsDiff['item']['version']>
        name={fields.version.name}
        // eslint-disable-next-line react/no-unstable-nested-components
        review={({ createLabel, status, value }) => {
          return (
            <TextField
              color={`review ${status}`}
              isReadOnly
              label={createLabel(fields.version.label)}
              value={value}
            />
          )
        }}
      >
        <FormTextField {...fields.version} />
      </ReviewField>

      <ReviewField<ItemsDiff['item']['description']>
        name={fields.description.name}
        // eslint-disable-next-line react/no-unstable-nested-components
        review={({ createLabel, status, value }) => {
          return (
            <TextArea
              color={`review ${status}`}
              isReadOnly
              isRequired
              label={createLabel(fields.description.label)}
              rows={6}
              value={value}
            />
          )
        }}
      >
        <FormTextArea {...fields.description} rows={6} />
      </ReviewField>

      <ReviewAccessibleAtFormFieldArray field={fields.accessibleAt} />

      <ReviewExternalIdsFormFieldArray field={fields.externalIds} />
    </FormSection>
  )
}
