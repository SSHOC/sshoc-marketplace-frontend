import { useGetAllItemSources } from '@/api/sshoc'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { FormTextArea } from '@/modules/form/components/FormTextArea/FormTextArea'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { FormFieldArray } from '@/modules/form/FormFieldArray'
import helpText from '@@/config/form-helptext.json'

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
          helpText={helpText.label}
        />
        <FormTextField
          name={`${prefix}version`}
          label={'Version'}
          variant="form"
          // helpText={helpText.version}
        />
      </div>
      <FormTextArea
        name={`${prefix}description`}
        label={'Description'}
        isRequired
        rows={8}
        variant="form"
        helpText={helpText.description}
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
                        onPress={() => {
                          fields.remove(index)
                        }}
                        aria-label={'Remove URL'}
                      />
                    }
                  >
                    <FormTextField
                      name={name}
                      label={'Accessible at'}
                      variant="form"
                      style={{ flex: 1 }}
                      helpText={helpText.accessibleAt}
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
      <FormFieldArray name="externalIds">
        {({ fields }) => {
          return (
            <FormRecords>
              {fields.map((name, index) => {
                return (
                  <FormRecord
                    key={name}
                    actions={
                      <FormFieldRemoveButton
                        onPress={() => {
                          fields.remove(index)
                        }}
                        aria-label={'Remove external ID'}
                      />
                    }
                  >
                    <ExternalIdServiceSelect
                      name={`${name}.identifierService.code`}
                      label="ID Service"
                    />
                    <FormTextField
                      name={`${name}.identifier`}
                      label="Identifier"
                      variant="form"
                      style={{ flex: 1 }}
                      helpText={helpText.externalId}
                    />
                  </FormRecord>
                )
              })}
              <FormFieldAddButton onPress={() => fields.push(undefined)}>
                {'Add external ID'}
              </FormFieldAddButton>
            </FormRecords>
          )
        }}
      </FormFieldArray>
    </FormSection>
  )
}

export interface ExternalIdServiceSelectProps {
  name: string
  label: string
}

/**
 * External item ID.
 */
function ExternalIdServiceSelect(
  props: ExternalIdServiceSelectProps,
): JSX.Element {
  const sources = useGetAllItemSources()

  return (
    <FormSelect
      name={props.name}
      label={props.label}
      items={sources.data ?? []}
      isLoading={sources.isLoading}
      variant="form"
    >
      {(item) => (
        <FormSelect.Item key={item.code}>{item.label}</FormSelect.Item>
      )}
    </FormSelect>
  )
}
