import { VisuallyHidden } from '@react-aria/visually-hidden'

import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { AccessibleAtFormFieldArray } from '@/components/item-form/AccessibleAtFormFieldArray'
import { ExternalIdsFormFieldArray } from '@/components/item-form/ExternalIdsFormFieldArray'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { FormTextArea } from '@/lib/core/form/FormTextArea'
import { FormTextField } from '@/lib/core/form/FormTextField'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface MainFormSectionProps {
  formFields: ItemFormFields
}

export function MainFormSection(props: MainFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const { t } = useI18n<'authenticated' | 'common'>()

  return (
    <FormSection>
      <VisuallyHidden>
        <FormSectionTitle>{t(['authenticated', 'forms', 'main-section'])}</FormSectionTitle>
      </VisuallyHidden>
      <FormTextField {...fields.label} />
      <FormTextField {...fields.version} />
      <FormTextArea {...fields.description} rows={6} />
      <AccessibleAtFormFieldArray field={fields.accessibleAt} />
      <ExternalIdsFormFieldArray field={fields.externalIds} />
    </FormSection>
  )
}
