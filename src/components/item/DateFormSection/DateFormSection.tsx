import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'

/**
 * Form section for dates.
 */
export function DateFormSection(): JSX.Element {
  return (
    <FormSection style={{ alignItems: 'start' }}>
      <FormTextField
        name="dateCreated"
        label={'Date created'}
        type="date"
        variant="form"
      />
      <FormTextField
        name="dateLastUpdated"
        label={'Date last updated'}
        type="date"
        variant="form"
      />
    </FormSection>
  )
}
