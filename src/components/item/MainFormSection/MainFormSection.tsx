import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormTextArea } from '@/modules/form/components/FormTextArea/FormTextArea'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { FormFieldArray } from '@/modules/form/FormFieldArray'

/**
 * Main form section for item label, version, description, and URLs.
 */
export function MainFormSection(): JSX.Element {
  return (
    <FormSection>
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 100px' }}>
        <FormTextField name="label" label={'Label'} isRequired variant="form" />
        <FormTextField name="version" label={'Version'} variant="form" />
      </div>
      <FormTextArea
        name="description"
        label={'Description'}
        isRequired
        rows={4}
        variant="form"
      />
      <FormFieldArray name="accessibleAt">
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
