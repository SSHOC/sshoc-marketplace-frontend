import { useButton } from '@react-aria/button'
import type { AriaButtonProps } from '@react-types/button'
import cx from 'clsx'
// import type { ReactNode } from 'react'
import { useRef } from 'react'

import { Icon } from '@/elements/Icon/Icon'
import { Svg as CrossIcon } from '@/elements/icons/small/cross.svg'

export interface FormFieldRemoveButtonProps extends AriaButtonProps {
  onPress: () => void
  // children?: ReactNode
}

/**
 * Removes record from field array.
 */
export function FormFieldRemoveButton(
  props: FormFieldRemoveButtonProps,
): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  const styles = {
    button: cx(
      // 'px-5  py-5' /** Match form field height. */,
      'cursor-default flex-grow-0 flex-shrink-0 transition inline-flex space-x-1.5 items-center font-body font-normal font-ui-base text-primary-750 hover:text-secondary-600 focus:text-gray-800 focus:outline-none',
    ),
    icon: 'w-2.5 h-2.5',
  }

  return (
    <button {...buttonProps} className={styles.button}>
      <Icon icon={CrossIcon} className={styles.icon} />
      {/* <span>{props.children}</span> */}
      <span>Delete</span>
    </button>
  )
}
