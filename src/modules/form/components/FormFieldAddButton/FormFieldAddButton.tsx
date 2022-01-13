import { useButton } from '@react-aria/button'
import type { AriaButtonProps } from '@react-types/button'
import cx from 'clsx'
import type { ReactNode } from 'react'
import { useRef } from 'react'

import { Icon } from '@/elements/Icon/Icon'
import { Svg as PlusIcon } from '@/elements/icons/small/plus.svg'

export interface FormFieldAddButtonProps extends AriaButtonProps {
  onPress: () => void
  children?: ReactNode
}

/**
 * Adds new record to field array.
 */
export function FormFieldAddButton(
  props: FormFieldAddButtonProps,
): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  const styles = {
    button: cx(
      'transition cursor-default inline-flex space-x-1.5 items-center font-body font-normal text-ui-base hover:text-secondary-600 focus:text-gray-800 focus:outline-none',
      props.isDisabled === true
        ? 'pointer-events-none text-gray-550'
        : 'text-primary-750',
    ),
    icon: 'w-2.5 h-2.5',
  }

  return (
    <button {...buttonProps} className={styles.button}>
      <Icon icon={PlusIcon} className={styles.icon} />
      <span>{props.children}</span>
    </button>
  )
}
