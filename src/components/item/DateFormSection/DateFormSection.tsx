import get from 'lodash.get'
import { Fragment } from 'react'

import type { ItemsDifferencesDto } from '@/api/sshoc'
import { formatDate } from '@/api/sshoc/helpers'
import { HelpText } from '@/elements/HelpText/HelpText'
import { TextField } from '@/elements/TextField/TextField'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { DiffControls } from '@/modules/form/diff/DiffControls'
import { DiffField } from '@/modules/form/diff/DiffField'
import helpText from '@@/config/form-helptext.json'

export interface DateFormSectionProps {
  prefix?: string
  diff?: ItemsDifferencesDto
}

/**
 * Form section for dates.
 */
export function DateFormSection(props: DateFormSectionProps): JSX.Element {
  const prefix = props.prefix ?? ''
  const isDiffingEnabled = props.diff != null && props.diff.equal === false
  const diff = props.diff ?? {}

  const dateCreatedField = {
    name: `${prefix}dateCreated`,
    label: 'Date created',
    approvedValue: getDateString(get(diff.item, `${prefix}dateCreated`)),
    suggestedValue: getDateString(get(diff.other, `${prefix}dateCreated`)),
    help: helpText.dateCreated,
  }

  const dateLastUpdatedField = {
    name: `${prefix}dateLastUpdated`,
    label: 'Date last updated',
    approvedValue: getDateString(get(diff.item, `${prefix}dateLastUpdated`)),
    suggestedValue: getDateString(get(diff.other, `${prefix}dateLastUpdated`)),
    help: helpText.dateLastUpdated,
  }

  return (
    <FormSection style={{ alignItems: 'start' }}>
      <DiffField
        name={dateCreatedField.name}
        approvedValue={dateCreatedField.approvedValue}
        suggestedValue={dateCreatedField.suggestedValue}
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
                  <div className="grid flex-1 gap-1 py-2">
                    <TextField
                      type="date"
                      label={dateCreatedField.label}
                      isReadOnly
                      variant="form-diff"
                      value={suggestedValue as string | undefined}
                    />
                    <TextField
                      type="date"
                      aria-label={`${dateCreatedField.label} (approved)`}
                      isReadOnly
                      variant="form"
                      value={approvedValue as string | undefined}
                    />
                    <HelpText>{dateCreatedField.help}</HelpText>
                  </div>
                </div>
              ) : (
                <FormTextField
                  type="date"
                  name={name}
                  label={dateCreatedField.label}
                  helpText={dateCreatedField.help}
                />
              )}
            </Fragment>
          )
        }}
      </DiffField>

      <DiffField
        name={dateLastUpdatedField.name}
        approvedValue={dateLastUpdatedField.approvedValue}
        suggestedValue={dateLastUpdatedField.suggestedValue}
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
                  <div className="grid flex-1 gap-1 py-2">
                    <TextField
                      type="date"
                      label={dateLastUpdatedField.label}
                      isReadOnly
                      variant="form-diff"
                      value={suggestedValue as string | undefined}
                    />
                    <TextField
                      type="date"
                      aria-label={`${dateLastUpdatedField.label} (approved)`}
                      isReadOnly
                      variant="form"
                      value={approvedValue as string | undefined}
                    />
                    <HelpText>{dateLastUpdatedField.help}</HelpText>
                  </div>
                </div>
              ) : (
                <FormTextField
                  type="date"
                  name={name}
                  label={dateLastUpdatedField.label}
                  helpText={dateLastUpdatedField.help}
                />
              )}
            </Fragment>
          )
        }}
      </DiffField>
    </FormSection>
  )
}

function getDateString(str: string | undefined): string | undefined {
  if (str == null) return undefined

  const date = new Date(str)

  return formatDate(date)
}
