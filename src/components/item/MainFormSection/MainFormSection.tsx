import get from 'lodash.get'
import { Fragment } from 'react'

import type { ItemsDifferencesDto } from '@/api/sshoc'
import { useGetAllItemSources } from '@/api/sshoc'
import { HelpText } from '@/elements/HelpText/HelpText'
import { Select } from '@/elements/Select/Select'
import { TextArea } from '@/elements/TextArea/TextArea'
import { TextField } from '@/elements/TextField/TextField'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { FormTextArea } from '@/modules/form/components/FormTextArea/FormTextArea'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { DiffControls } from '@/modules/form/diff/DiffControls'
import { DiffField } from '@/modules/form/diff/DiffField'
import { DiffFieldArray } from '@/modules/form/diff/DiffFieldArray'
import helpText from '@@/config/form-helptext.json'

export interface MainFormSectionProps {
  prefix?: string
  diff?: ItemsDifferencesDto
}

/**
 * Main form section for item label, version, description, and URLs.
 */
export function MainFormSection(props: MainFormSectionProps): JSX.Element {
  const prefix = props.prefix ?? ''
  const isDiffingEnabled = props.diff != null && props.diff.equal === false
  const diff = props.diff ?? {}

  const labelField = {
    name: `${prefix}label`,
    label: 'Label',
    approvedValue: get(diff.item, `${prefix}label`),
    suggestedValue: get(diff.other, `${prefix}label`),
    help: helpText.label,
  }

  const versionField = {
    name: `${prefix}version`,
    label: 'Version',
    approvedValue: get(diff.item, `${prefix}version`),
    suggestedValue: get(diff.other, `${prefix}version`),
    help: helpText.version,
  }

  const descriptionField = {
    name: `${prefix}description`,
    label: 'Description',
    approvedValue: get(diff.item, `${prefix}description`),
    suggestedValue: get(diff.other, `${prefix}description`),
    help: helpText.description,
  }

  const accessibleAtFieldArray = {
    name: `${prefix}accessibleAt`,
    label: 'Accessible at',
    approvedValue: get(diff.item, `${prefix}accessibleAt`),
    suggestedValue: get(diff.other, `${prefix}accessibleAt`),
    help: helpText.accessibleAt,
  }

  const externalIdsFieldArray = {
    name: `${prefix}externalIds`,
    label: 'External IDs',
    approvedValue: get(diff.item, `${prefix}externalIds`),
    suggestedValue: get(diff.other, `${prefix}externalIds`),
    help: helpText.externalId,
  }

  return (
    <FormSection>
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 100px' }}>
        <DiffField
          name={labelField.name}
          approvedValue={labelField.approvedValue}
          suggestedValue={labelField.suggestedValue}
          isEnabled={isDiffingEnabled}
        >
          {({
            name,
            isReviewed,
            status,
            onApprove,
            onReject,
            approvedValue,
            suggestedValue,
          }) => {
            const requiresReview = status !== 'unchanged' && !isReviewed

            return (
              <Fragment>
                {requiresReview ? (
                  <div className="relative" style={{ gridColumn: '1 / -1' }}>
                    <DiffControls
                      status={status}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                    <div className="grid flex-1 gap-1">
                      <TextField
                        label={labelField.label}
                        isRequired
                        isReadOnly
                        variant="form-diff"
                        value={suggestedValue as string | undefined}
                      />
                      <TextField
                        aria-label={`${labelField.label} (approved)`}
                        isReadOnly
                        variant="form"
                        value={approvedValue as string | undefined}
                      />
                      <HelpText>{labelField.help}</HelpText>
                    </div>
                  </div>
                ) : (
                  <FormTextField
                    name={name}
                    label={labelField.label}
                    isRequired
                    helpText={labelField.help}
                  />
                )}
              </Fragment>
            )
          }}
        </DiffField>

        <DiffField
          name={versionField.name}
          approvedValue={versionField.approvedValue}
          suggestedValue={versionField.suggestedValue}
          isEnabled={isDiffingEnabled}
        >
          {({
            name,
            isReviewed,
            status,
            onApprove,
            onReject,
            approvedValue,
            suggestedValue,
          }) => {
            const requiresReview = status !== 'unchanged' && !isReviewed

            return (
              <Fragment>
                {requiresReview ? (
                  <div className="relative" style={{ gridColumn: '1 / -1' }}>
                    <DiffControls
                      status={status}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                    <div className="grid flex-1 gap-1">
                      <TextField
                        label={versionField.label}
                        isReadOnly
                        variant="form-diff"
                        value={suggestedValue as string | undefined}
                      />
                      <TextField
                        aria-label={`${versionField.label} (approved)`}
                        isReadOnly
                        variant="form"
                        value={approvedValue as string | undefined}
                      />
                      <HelpText>{versionField.help}</HelpText>
                    </div>
                  </div>
                ) : (
                  <FormTextField
                    name={name}
                    label={versionField.label}
                    helpText={versionField.help}
                  />
                )}
              </Fragment>
            )
          }}
        </DiffField>
      </div>

      <DiffField
        name={descriptionField.name}
        approvedValue={descriptionField.approvedValue}
        suggestedValue={descriptionField.suggestedValue}
        isEnabled={isDiffingEnabled}
      >
        {({
          name,
          isReviewed,
          status,
          onApprove,
          onReject,
          approvedValue,
          suggestedValue,
        }) => {
          const requiresReview = status !== 'unchanged' && !isReviewed

          return (
            <Fragment>
              {requiresReview ? (
                <div className="relative">
                  <DiffControls
                    status={status}
                    onApprove={onApprove}
                    onReject={onReject}
                  />
                  <div className="grid flex-1 gap-1">
                    <TextArea
                      isRequired
                      label={descriptionField.label}
                      isReadOnly
                      variant="form-diff"
                      value={suggestedValue as string | undefined}
                      rows={8}
                    />
                    <TextArea
                      aria-label={`${descriptionField.label} (approved)`}
                      isReadOnly
                      variant="form"
                      value={approvedValue as string | undefined}
                      rows={8}
                    />
                    <HelpText>{descriptionField.help}</HelpText>
                  </div>
                </div>
              ) : (
                <FormTextArea
                  name={name}
                  label={descriptionField.label}
                  isRequired
                  helpText={descriptionField.help}
                  rows={8}
                />
              )}
            </Fragment>
          )
        }}
      </DiffField>

      <DiffFieldArray
        name={accessibleAtFieldArray.name}
        approvedValue={accessibleAtFieldArray.approvedValue}
        suggestedValue={accessibleAtFieldArray.suggestedValue}
        actions={({ onAdd, arrayRequiresReview }) => {
          if (arrayRequiresReview === true) return null

          return (
            <FormFieldAddButton onPress={onAdd}>Add URL</FormFieldAddButton>
          )
        }}
        isEnabled={isDiffingEnabled}
      >
        {({
          name,
          isReviewed,
          status,
          onApprove,
          onReject,
          approvedValue,
          suggestedValue,
          onRemove,
          arrayRequiresReview,
        }) => {
          const requiresReview = status !== 'unchanged' && !isReviewed

          return (
            <Fragment>
              {requiresReview ? (
                <FormRecord
                  className="py-2"
                  actions={
                    <DiffControls
                      status={status}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  }
                >
                  <div className="grid flex-1 gap-1">
                    <TextField
                      label={accessibleAtFieldArray.label}
                      isReadOnly
                      variant="form-diff"
                      value={suggestedValue as string | undefined}
                    />
                    <TextField
                      aria-label={`${accessibleAtFieldArray.label} (approved)`}
                      isReadOnly
                      variant="form"
                      value={approvedValue as string | undefined}
                    />
                    <HelpText>{accessibleAtFieldArray.help}</HelpText>
                  </div>
                </FormRecord>
              ) : (
                <FormRecord
                  actions={
                    arrayRequiresReview === true ? null : (
                      <FormFieldRemoveButton
                        onPress={onRemove}
                        aria-label="Remove URL"
                      />
                    )
                  }
                >
                  <FormTextField
                    name={name}
                    label={accessibleAtFieldArray.label}
                    helpText={accessibleAtFieldArray.help}
                    style={{ flex: 1 }}
                  />
                </FormRecord>
              )}
            </Fragment>
          )
        }}
      </DiffFieldArray>

      <DiffFieldArray
        name={externalIdsFieldArray.name}
        approvedValue={externalIdsFieldArray.approvedValue}
        suggestedValue={externalIdsFieldArray.suggestedValue}
        actions={({ onAdd, arrayRequiresReview }) => {
          if (arrayRequiresReview === true) return null

          return (
            <FormFieldAddButton onPress={onAdd}>
              Add external ID
            </FormFieldAddButton>
          )
        }}
        isEnabled={isDiffingEnabled}
      >
        {({
          name,
          isReviewed,
          status,
          onApprove,
          onReject,
          approvedValue,
          suggestedValue,
          onRemove,
          arrayRequiresReview,
        }) => {
          const requiresReview = status !== 'unchanged' && !isReviewed

          const identifierServiceField = {
            name: `${name}.identifierService.code`,
            label: 'ID Service',
            approvedValue: get(approvedValue, 'identifierService.code'),
            approvedItem: get(approvedValue, 'identifierService'),
            suggestedValue: get(suggestedValue, 'identifierService.code'),
            suggestedItem: get(suggestedValue, 'identifierService'),
          }

          const identifierField = {
            name: `${name}.identifier`,
            label: 'Identifier',
            approvedValue: get(approvedValue, 'identifier') as
              | string
              | undefined,
            suggestedValue: get(suggestedValue, 'identifier') as
              | string
              | undefined,
          }

          return (
            <Fragment>
              {requiresReview ? (
                <FormRecord
                  className="py-2"
                  actions={
                    <DiffControls
                      status={status}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  }
                >
                  <div className="grid content-start gap-1">
                    <Select
                      label={identifierServiceField.label}
                      isReadOnly
                      variant="form-diff"
                      selectedKey={identifierServiceField.suggestedValue}
                      items={[identifierServiceField.suggestedItem]}
                    >
                      {(item) => {
                        return (
                          <Select.Item key={item.code}>
                            {item.label}
                          </Select.Item>
                        )
                      }}
                    </Select>
                    <Select
                      aria-label={`${identifierServiceField.label} (approved)`}
                      isReadOnly
                      variant="form"
                      selectedKey={identifierServiceField.approvedValue}
                      items={[identifierServiceField.approvedItem]}
                    >
                      {(item) => {
                        return (
                          <Select.Item key={item.code}>
                            {item.label}
                          </Select.Item>
                        )
                      }}
                    </Select>
                  </div>
                  <div className="grid content-start flex-1 gap-1">
                    <TextField
                      label={identifierField.label}
                      isReadOnly
                      variant="form-diff"
                      value={identifierField.suggestedValue}
                    />
                    <TextField
                      aria-label={`${identifierField.label} (approved)`}
                      isReadOnly
                      variant="form"
                      value={identifierField.approvedValue}
                    />
                    <HelpText>{externalIdsFieldArray.help}</HelpText>
                  </div>
                </FormRecord>
              ) : (
                <FormRecord
                  actions={
                    arrayRequiresReview === true ? null : (
                      <FormFieldRemoveButton
                        onPress={onRemove}
                        aria-label="Remove external ID"
                      />
                    )
                  }
                >
                  <ExternalIdServiceSelect
                    name={identifierServiceField.name}
                    label={identifierServiceField.label}
                  />
                  <FormTextField
                    name={identifierField.name}
                    label={identifierField.label}
                    helpText={externalIdsFieldArray.help}
                    style={{ flex: 1 }}
                  />
                </FormRecord>
              )}
            </Fragment>
          )
        }}
      </DiffFieldArray>
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
