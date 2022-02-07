import { useButton } from '@react-aria/button'
import { useMessageFormatter } from '@react-aria/i18n'
import type { AriaButtonProps } from '@react-types/button'
import cx from 'clsx'
import { useRef } from 'react'

import dictionary from '@/elements/ClearButton/dictionary.json'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CrossIcon } from '@/elements/icons/small/cross.svg'

export interface ClearButtonProps extends AriaButtonProps {
  className?: string
  preventFocus?: boolean
}

/**
 * Clear button.
 */
export function ClearButton(props: ClearButtonProps): JSX.Element {
  const preventFocus = props.preventFocus === true
  const elementType = preventFocus ? 'div' : 'button'

  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ ...props, elementType }, ref)
  const t = useMessageFormatter(dictionary)

  /**
   * @see https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/button/src/ClearButton.tsx#L47-L52
   */
  if (preventFocus) {
    delete buttonProps.tabIndex
  }

  const ariaLabel = props['aria-label'] ?? t('clear')
  const isDisabled = props.isDisabled === true

  const styles = {
    button: cx(props.className, isDisabled && 'pointer-events-none'),
  }

  return (
    <button {...buttonProps} aria-label={ariaLabel} className={styles.button} ref={ref}>
      <Icon icon={CrossIcon} className="h-2" />
    </button>
  )
}
