import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'

export interface DateFormSectionProps {
  prefix?: string
}

/**
 * Form section for dates.
 */
export function DateFormSection(props: DateFormSectionProps): JSX.Element {
  const prefix = props.prefix ?? ''

  return (
    <FormSection style={{ alignItems: 'start' }}>
      <FormTextField
        name={`${prefix}dateCreated`}
        label={'Date created'}
        type="date"
        variant="form"
      />
      <FormTextField
        name={`${prefix}dateLastUpdated`}
        label={'Date last updated'}
        type="date"
        variant="form"
      />
    </FormSection>
  )
}
