import cx from 'clsx'
import type { ReactNode } from 'react'

export interface FormRecordsProps {
  className?: string
  children?: ReactNode
}

/**
 * Groups a set of form records.
 */
export function FormRecords(props: FormRecordsProps): JSX.Element {
  return (
    <div className={cx('flex flex-col space-y-6', props.className)}>
      {props.children}
    </div>
  )
}
