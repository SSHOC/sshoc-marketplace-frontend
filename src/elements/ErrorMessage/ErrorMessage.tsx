import { useMessageFormatter } from '@react-aria/i18n'
import type { DOMProps } from '@react-types/shared'
import type { ReactNode } from 'react'

import dictionary from '@/elements/ErrorMessage/dictionary.json'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as InfoIcon } from '@/elements/icons/small/info.svg'

export interface ErrorMessageProps extends DOMProps {
  children?: ReactNode
}

/**
 * Error message for form fields.
 */
export function ErrorMessage(props: ErrorMessageProps): JSX.Element {
  const t = useMessageFormatter(dictionary)

  const message = props.children ?? t('error')

  const styles = {
    message:
      'font-body font-normal text-ui-base text-error-500 inline-flex items-center space-x-1 select-none cursor-default',
  }

  return (
    <div className={styles.message}>
      <Icon icon={InfoIcon} />
      <span id={props.id}>{message}</span>
    </div>
  )
}
