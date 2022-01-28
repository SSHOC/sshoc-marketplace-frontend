import cx from 'clsx'
import get from 'lodash.get'

import { useGetAllItemSources } from '@/api/sshoc'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { DiffField } from '@/modules/form/diff/DiffField'
import { DiffFormSelect } from '@/modules/form/diff/DiffFormSelect'
import { DiffFormTextArea } from '@/modules/form/diff/DiffFormTextArea'
import { DiffFormTextField } from '@/modules/form/diff/DiffFormTextField'
import { FormFieldArray } from '@/modules/form/FormFieldArray'
import helpText from '@@/config/form-helptext.json'

export interface MainFormSectionProps {
  prefix?: string
  diff?: any
}

/**
 * Main form section for item label, version, description, and URLs.
 */
export function MainFormSection(props: MainFormSectionProps): JSX.Element {
  // FIXME: handle prefix in diff fields
  const prefix = props.prefix ?? ''
  const diff = props.diff ?? {}

  const labelName = `${prefix}label`
  const descriptionName = `${prefix}description`
  const versionName = `${prefix}version`

  return (
    <FormSection>
      <div
        className={cx(
          'grid gap-4',
          diff.item?.version === diff.other?.version &&
            'md:grid-cols-[1fr_100px]',
        )}
      >
        <DiffField
          name={labelName}
          approvedValue={get(diff.item, labelName)}
          suggestedValue={get(diff.other, labelName)}
        >
          <DiffFormTextField
            name={labelName}
            label={'Label'}
            isRequired
            variant="form"
            helpText={helpText.label}
            approvedValue={get(diff.item, labelName)}
          />
        </DiffField>
        <DiffField
          name={versionName}
          approvedValue={get(diff.item, versionName)}
          suggestedValue={get(diff.other, versionName)}
        >
          <DiffFormTextField
            name={versionName}
            label={'Version'}
            variant="form"
            // helpText={helpText.version}
            approvedValue={get(diff.item, versionName)}
          />
        </DiffField>
      </div>
      <DiffField
        name={descriptionName}
        approvedValue={get(diff.item, descriptionName)}
        suggestedValue={get(diff.other, descriptionName)}
      >
        <DiffFormTextArea
          name={descriptionName}
          label={'Description'}
          isRequired
          rows={8}
          variant={'form'}
          helpText={helpText.description}
          approvedValue={get(diff.item, descriptionName)}
        />
      </DiffField>
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
                    <DiffField
                      name={name}
                      approvedValue={get(diff.item, name)}
                      suggestedValue={get(diff.other, name)}
                      isArrayField
                    >
                      <DiffFormTextField
                        name={name}
                        label={'Accessible at'}
                        variant="form"
                        style={{ flex: 1 }}
                        helpText={helpText.accessibleAt}
                        approvedValue={get(diff.item, name)}
                      />
                    </DiffField>
                  </FormRecord>
                )
              })}
              {/* Items might have been deleted so the array will be shorter than in the approved version. */}
              {get(diff.item, `${prefix}accessibleAt`)
                .slice(fields.length)
                .map((field: string, _index: number) => {
                  const index = (fields.length ?? 0) + _index
                  const name = `${prefix}accessibleAt.${index}`

                  return (
                    <FormRecord key={name}>
                      <DiffField
                        name={name}
                        approvedValue={get(diff.item, name)}
                        suggestedValue={get(diff.other, name)}
                        isArrayField
                      >
                        <DiffFormTextField
                          name={name}
                          label={'Accessible at'}
                          variant="form"
                          style={{ flex: 1 }}
                          helpText={helpText.accessibleAt}
                          approvedValue={get(diff.item, name)}
                        />
                      </DiffField>
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
      <FormFieldArray name={`${prefix}externalIds`}>
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
                    <DiffField
                      name={name}
                      approvedValue={get(diff.item, name)}
                      suggestedValue={get(diff.other, name)}
                      isArrayField
                    >
                      <ExternalIdServiceSelect
                        name={`${name}.identifierService.code`}
                        label="ID Service"
                        approvedKey={get(
                          diff.item,
                          `${name}.identifierService.code`,
                        )}
                        approvedItem={get(
                          diff.item,
                          `${name}.identifierService`,
                        )}
                      />
                      <DiffFormTextField
                        name={`${name}.identifier`}
                        label="Identifier"
                        variant="form"
                        style={{ flex: 1 }}
                        helpText={helpText.externalId}
                        approvedValue={get(diff.item, `${name}.identifier`)}
                      />
                    </DiffField>
                  </FormRecord>
                )
              })}
              {/* Items might have been deleted so the array will be shorter than in the approved version. */}
              {get(diff.item, `${prefix}externalIds`)
                .slice(fields.length)
                .map((field: string, _index: number) => {
                  const index = (fields.length ?? 0) + _index
                  const name = `${prefix}externalIds.${index}`

                  return (
                    <FormRecord key={name}>
                      <DiffField
                        name={name}
                        approvedValue={get(diff.item, name)}
                        suggestedValue={get(diff.other, name)}
                        isArrayField
                      >
                        <ExternalIdServiceSelect
                          name={`${name}.identifierService.code`}
                          label="ID Service"
                          approvedKey={get(
                            diff.item,
                            `${name}.identifierService.code`,
                          )}
                          approvedItem={get(
                            diff.item,
                            `${name}.identifierService`,
                          )}
                        />
                        <DiffFormTextField
                          name={`${name}.identifier`}
                          label="Identifier"
                          variant="form"
                          style={{ flex: 1 }}
                          helpText={helpText.externalId}
                          approvedValue={get(diff.item, `${name}.identifier`)}
                        />
                      </DiffField>
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
  approvedKey: string | undefined
  approvedItem: any | undefined
}

/**
 * External item ID.
 */
function ExternalIdServiceSelect(
  props: ExternalIdServiceSelectProps,
): JSX.Element {
  const sources = useGetAllItemSources()

  return (
    <DiffFormSelect
      name={props.name}
      label={props.label}
      items={sources.data ?? []}
      isLoading={sources.isLoading}
      variant="form"
      approvedKey={props.approvedKey}
      approvedItem={props.approvedItem}
    >
      {(item) => (
        <FormSelect.Item key={item.code}>{item.label}</FormSelect.Item>
      )}
    </DiffFormSelect>
  )
}
