import { Fragment } from 'react'

import { HelpText } from '@/elements/HelpText/HelpText'
import { TextArea } from '@/elements/TextArea/TextArea'
import type { FormTextAreaProps } from '@/modules/form/components/FormTextArea/FormTextArea'
import { FormTextArea } from '@/modules/form/components/FormTextArea/FormTextArea'
import { useDiffStateContext } from '@/modules/form/diff/DiffStateContext'

export interface DiffFormTextAreaProps extends FormTextAreaProps {
  approvedValue?: string | null
}

export function DiffFormTextArea({
  approvedValue,
  ...props
}: DiffFormTextAreaProps): JSX.Element {
  const { requiresReview, status } = useDiffStateContext()

  if (!requiresReview) {
    return <FormTextArea {...props} />
  }

  return (
    <Fragment>
      {status !== 'deleted' ? (
        <FormTextArea
          {...props}
          variant="form-diff"
          /** Require either approve or reject before allowing further edits. */
          isReadOnly
          /** Dont' show helptext *between* fields. */
          helpText={undefined}
        />
      ) : null}
      {status !== 'inserted' ? (
        <TextArea
          aria-label={
            status !== 'deleted' ? props.label + ' (approved)' : undefined
          }
          label={status === 'deleted' ? props.label : undefined}
          isReadOnly
          rows={8}
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
