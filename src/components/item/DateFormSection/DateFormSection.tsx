import get from 'lodash.get'

import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { DiffField } from '@/modules/form/diff/DiffField'
import { DiffFormTextField } from '@/modules/form/diff/DiffFormTextField'

export interface DateFormSectionProps {
  prefix?: string
  diff?: any
}

/**
 * Form section for dates.
 */
export function DateFormSection(props: DateFormSectionProps): JSX.Element {
  const prefix = props.prefix ?? ''
  const diff = props.diff ?? {}

  const dateCreatedName = `${prefix}dateCreated`
  const dateLastUpdatedName = `${prefix}dateLastUpdated`

  return (
    <FormSection style={{ alignItems: 'start' }}>
      <DiffField
        name={dateCreatedName}
        approvedValue={get(diff.item, dateCreatedName)}
        suggestedValue={get(diff.other, dateCreatedName)}
      >
        <DiffFormTextField
          name={dateCreatedName}
          label={'Date created'}
          type="date"
          variant="form"
          approvedValue={get(diff.item, dateCreatedName)}
        />
      </DiffField>
      <DiffField
        name={dateLastUpdatedName}
        approvedValue={get(diff.item, dateLastUpdatedName)}
        suggestedValue={get(diff.other, dateLastUpdatedName)}
      >
        <DiffFormTextField
          name={dateLastUpdatedName}
          label={'Date last updated'}
          type="date"
          variant="form"
          approvedValue={get(diff.item, dateLastUpdatedName)}
        />
      </DiffField>
    </FormSection>
  )
}
