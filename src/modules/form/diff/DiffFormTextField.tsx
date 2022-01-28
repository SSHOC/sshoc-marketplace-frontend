import { Fragment } from 'react'

import { HelpText } from '@/elements/HelpText/HelpText'
import { TextField } from '@/elements/TextField/TextField'
import type { FormTextFieldProps } from '@/modules/form/components/FormTextField/FormTextField'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { useDiffStateContext } from '@/modules/form/diff/DiffStateContext'

export interface DiffFormTextFieldProps extends FormTextFieldProps {
  approvedValue: string | null
}

export function DiffFormTextField({
  approvedValue,
  ...props
}: DiffFormTextFieldProps): JSX.Element {
  const { requiresReview, status } = useDiffStateContext()

  if (!requiresReview) {
    return <FormTextField {...props} />
  }

  return (
    <Fragment>
      {status !== 'deleted' ? (
        <FormTextField
          {...props}
          variant="form-diff"
          /** Require either approve or reject before allowing further edits. */
          isReadOnly
          /** Dont' show helptext *between* fields. */
          helpText={undefined}
        />
      ) : null}
      {status !== 'inserted' ? (
        <TextField
          aria-label={
            status !== 'deleted' ? props.label + ' (approved)' : undefined
          }
          label={status === 'deleted' ? props.label : undefined}
          isReadOnly
          value={approvedValue ?? ''}
          variant={status === 'deleted' ? 'form-diff' : 'form'}
          style={{
            textDecoration:
              status === 'deleted' ? 'line-through 2px' : undefined,
            ...props.style,
          }}
        />
      ) : null}
      <HelpText>{props.helpText}</HelpText>
    </Fragment>
  )
}
