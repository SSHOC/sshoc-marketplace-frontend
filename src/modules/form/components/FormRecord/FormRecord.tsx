import cx from 'clsx'
import type { ReactNode } from 'react'

export interface FormRecordProps {
  className?: string
  children?: ReactNode
  actions?: ReactNode
}

/**
 * Groups a row of form fields which form a record.
 */
export function FormRecord(props: FormRecordProps): JSX.Element {
  return (
    <div
      className={cx(
        'flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 relative',
        props.className,
      )}
    >
      {props.children}
      {props.actions !== undefined ? (
        <div className="absolute top-0 right-0" style={{ marginTop: 0 }}>
          {props.actions}
        </div>
      ) : null}
    </div>
  )
}
