import cx from 'clsx'
import type { ReactNode } from 'react'

export interface FormRecordProps {
  className?: string
  children?: ReactNode
}

/**
 * Groups a row of form fields which form a record.
 */
export function FormRecord(props: FormRecordProps): JSX.Element {
  return (
    <div className={cx('flex items-end space-x-4 relative', props.className)}>
      {props.children}
    </div>
  )
}
