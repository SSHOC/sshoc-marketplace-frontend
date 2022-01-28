import { Fragment } from 'react'

import { ComboBox } from '@/elements/ComboBox/ComboBox'
import { HelpText } from '@/elements/HelpText/HelpText'
import type { FormComboBoxProps } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { useDiffStateContext } from '@/modules/form/diff/DiffStateContext'

export interface DiffFormComboBoxProps<T> extends FormComboBoxProps<T> {
  approvedKey: string | undefined
  approvedItem: T | undefined
}

export function DiffFormComboBox<T extends object>({
  approvedKey,
  approvedItem,
  ...props
}: DiffFormComboBoxProps<T>): JSX.Element {
  const { requiresReview, status } = useDiffStateContext()

  if (!requiresReview) {
    return <FormComboBox {...props} />
  }

  return (
    <Fragment>
      {status !== 'deleted' ? (
        <FormComboBox
          {...props}
          variant="form-diff"
          /** Require either approve or reject before allowing further edits. */
          isReadOnly
          /** Dont' show helptext *between* fields. */
          helpText={undefined}
        />
      ) : null}
      {status !== 'inserted' ? (
        <ComboBox
          aria-label={
            status !== 'deleted' ? props.label + ' (approved)' : undefined
          }
          label={status === 'deleted' ? props.label : undefined}
          isReadOnly
          items={approvedItem ? [approvedItem] : []}
          selectedKey={approvedKey}
          variant={status === 'deleted' ? 'form-diff' : 'form'}
          style={{
            textDecoration:
              status === 'deleted' ? 'line-through 2px' : undefined,
            ...props.style,
          }}
        >
          {props.children as any}
        </ComboBox>
      ) : null}
      <HelpText>{props.helpText}</HelpText>
    </Fragment>
  )
}
