import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormTextArea } from '@/modules/form/components/FormTextArea/FormTextArea'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { FormFieldArray } from '@/modules/form/FormFieldArray'

export interface MainFormSectionProps {
  prefix?: string
}

/**
 * Main form section for item label, version, description, and URLs.
 */
export function MainFormSection(props: MainFormSectionProps): JSX.Element {
  const prefix = props.prefix ?? ''

  return (
    <FormSection>
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 100px' }}>
        <FormTextField
          name={`${prefix}label`}
          label={'Label'}
          isRequired
          variant="form"
        />
        <FormTextField
          name={`${prefix}version`}
          label={'Version'}
          variant="form"
        />
      </div>
      <FormTextArea
        name={`${prefix}description`}
        label={'Description'}
        isRequired
        rows={4}
        variant="form"
      />
      <FormFieldArray name={`${prefix}accessibleAt`}>
        {({ fields }) => {
          return (
            <FormRecords>
              {fields.map((name, index) => {
                return (
                  <FormRecord
                    key={name}
                    actions={
                      <FormFieldRemoveButton
                        onPress={() => fields.remove(index)}
                        aria-label={'Remove URL'}
                      />
                    }
                  >
                    <FormTextField
                      name={name}
                      label={'Accessible at'}
                      variant="form"
                      style={{ flex: 1 }}
                    />
                  </FormRecord>
                )
              })}
              <FormFieldAddButton onPress={() => fields.push(undefined)}>
                {'Add URL'}
              </FormFieldAddButton>
            </FormRecords>
          )
        }}
      </FormFieldArray>
    </FormSection>
  )
}
