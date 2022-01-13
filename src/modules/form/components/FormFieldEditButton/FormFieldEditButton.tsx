import { useButton } from '@react-aria/button'
import type { AriaButtonProps } from '@react-types/button'
import cx from 'clsx'
// import type { ReactNode } from 'react'
import { useRef } from 'react'

import { Icon } from '@/elements/Icon/Icon'
import { Svg as PencilIcon } from '@/elements/icons/small/pencil.svg'

export interface FormFieldEditButtonProps extends AriaButtonProps {
  onPress: () => void
  // children?: ReactNode
}

/**
 * Edit record in field array.
 */
export function FormFieldEditButton(
  props: FormFieldEditButtonProps,
): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  const styles = {
    button: cx(
      // 'px-5  py-5' /** Match form field height. */,
      'cursor-default flex-grow-0 flex-shrink-0 transition inline-flex space-x-1.5 items-center font-body font-normal text-ui-base text-primary-750 hover:text-secondary-600 focus:text-gray-800 focus:outline-none',
    ),
    icon: 'w-3.5 h-3.5',
  }

  return (
    <button {...buttonProps} className={styles.button}>
      <Icon icon={PencilIcon} className={styles.icon} />
      {/* <span>{props.children}</span> */}
      <span>Edit</span>
    </button>
  )
}
