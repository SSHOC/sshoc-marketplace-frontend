import type { DOMProps } from '@react-types/shared'
import type { ReactNode } from 'react'

export interface HelpTextProps extends DOMProps {
  children?: ReactNode
}

/**
 * Help text for form fields.
 */
export function HelpText(props: HelpTextProps): JSX.Element {
  const message = props.children

  const styles = {
    message:
      'font-body font-normal text-ui-base text-gray-550 inline-flex items-center space-x-1 select-none cursor-default',
  }

  return (
    <div className={styles.message}>
      <span id={props.id}>{message}</span>
    </div>
  )
}
