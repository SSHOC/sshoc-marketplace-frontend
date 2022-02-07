import cx from 'clsx'
import type { CSSProperties, ReactNode } from 'react'

export interface FormRecordsProps {
  className?: string
  children?: ReactNode
  style?: CSSProperties
}

/**
 * Groups a set of form records.
 */
export function FormRecords(props: FormRecordsProps): JSX.Element {
  return (
    <div className={cx('flex flex-col space-y-6', props.className)} style={props.style}>
      {props.children}
    </div>
  )
}
