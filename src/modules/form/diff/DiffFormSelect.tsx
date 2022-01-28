import { Fragment } from 'react'

import { HelpText } from '@/elements/HelpText/HelpText'
import { Select } from '@/elements/Select/Select'
import type { FormSelectProps } from '@/modules/form/components/FormSelect/FormSelect'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { useDiffStateContext } from '@/modules/form/diff/DiffStateContext'

export interface DiffFormSelectProps<T> extends FormSelectProps<T> {
  approvedKey: string | undefined
  approvedItem: T | undefined
}

export function DiffFormSelect<T extends object>({
  approvedKey,
  approvedItem,
  ...props
}: DiffFormSelectProps<T>): JSX.Element {
  const { requiresReview, status } = useDiffStateContext()

  if (!requiresReview) {
    return <FormSelect {...props} />
  }

  return (
    <Fragment>
      {status !== 'deleted' ? (
        <FormSelect
          {...props}
          variant="form-diff"
          /** Require either approve or reject before allowing further edits. */
          isReadOnly
          /** Dont' show helptext *between* fields. */
          helpText={undefined}
        />
      ) : null}
      {status !== 'inserted' ? (
        <Select
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
        </Select>
      ) : null}
      <HelpText>{props.helpText}</HelpText>
    </Fragment>
  )
}
