import { useMessageFormatter } from '@react-aria/i18n'
import type { DOMProps } from '@react-types/shared'
import type { ReactNode } from 'react'

import { Icon } from '@/elements/Icon/Icon'
import { Svg as InfoIcon } from '@/elements/icons/small/info.svg'
import dictionary from '@/elements/SuccessMessage/dictionary.json'

export interface SuccessMessageProps extends DOMProps {
  children?: ReactNode
}

/**
 * Success message for form fields.
 */
export function SuccessMessage(props: SuccessMessageProps): JSX.Element {
  const t = useMessageFormatter(dictionary)

  const message = props.children ?? t('success')

  const styles = {
    message:
      'font-body font-normal text-ui-base text-success-500 inline-flex items-center space-x-1 select-none cursor-default',
  }

  return (
    <div className={styles.message}>
      <Icon icon={InfoIcon} />
      <span id={props.id}>{message}</span>
    </div>
  )
}
