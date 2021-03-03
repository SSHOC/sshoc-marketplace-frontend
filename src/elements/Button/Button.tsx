import { useButton } from '@react-aria/button'
import type { AriaButtonProps } from '@react-types/button'
import cx from 'clsx'
import type { RefObject } from 'react'
import { forwardRef, Fragment, useRef } from 'react'

import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'

export interface ButtonProps extends AriaButtonProps {
  isLoading?: boolean
  isPressed?: boolean
  /** @default "primary" */
  variant?: 'primary' | 'gradient' | 'link' | 'header' | 'nav'
}

function Button(
  props: ButtonProps,
  externalRef?: RefObject<HTMLButtonElement>,
): JSX.Element {
  const internalRef = useRef<HTMLButtonElement>(null)
  const ref = externalRef ?? internalRef
  const { buttonProps } = useButton(props, ref)

  const ElementType = props.elementType ?? 'button'
  const isDisabled = props.isDisabled === true
  /* In case of a menu button, `isPressed` is set by the parent. */
  const isPressed = props.isPressed === true

  const variants = {
    primary: {
      button: {
        default: 'transition px-10 py-3 text-ui-lg rounded',
        states: {
          enabled:
            'bg-primary-750 text-gray-75 hover:bg-secondary-600 focus:bg-primary-750',
          disabled: 'pointer-events-none bg-gray-100 text-gray-350',
        },
      },
      spinner: 'h-6 w-6',
    },
    gradient: {
      button: {
        default: 'transition-all px-10 py-3 text-ui-lg rounded',
        states: {
          enabled: cx(
            'bg-gradient-to-r from-secondary-350 to-primary-800 bg-double bg-right hover:bg-left text-gray-75',
            'bg-primary-750 hover:bg-secondary-600 focus:bg-primary-750',
          ),
          disabled: 'pointer-events-none bg-gray-100 text-gray-350',
        },
      },
      spinner: 'h-6 w-6',
    },
    link: {
      button: {
        default: 'transition text-ui-base',
        states: {
          enabled:
            'text-primary-750 hover:text-secondary-600 focus:text-text-800',
          disabled: 'pointer-events-none text-gray-350',
        },
      },
      spinner: 'hidden',
    },
    header: {
      button: {
        default: 'transition px-10 py-3 text-ui-sm rounded-b max-w-64',
        states: {
          enabled: cx(
            'bg-primary-750 text-gray-75 hover:bg-secondary-600 focus:bg-primary-750',
            isPressed && 'bg-secondary-600',
          ),
          disabled: 'pointer-events-none bg-gray-100 text-gray-350',
        },
      },
      spinner: 'h-4 w-4',
    },
    nav: {
      button: {
        default: cx(
          'text-ui-base rounded-t px-8 py-6 transition cursor-default transition',
          isPressed
            ? 'bg-secondary-600 text-white'
            : 'text-primary-750 hover:bg-gray-90 focus:bg-secondary-600 focus:text-white',
        ),
        states: {
          enabled: '',
          disabled: 'pointer-events-none bg-gray-100 text-gray-350',
        },
      },
      spinner: 'hidden',
    },
  }

  const variant = variants[props.variant ?? 'primary']

  const styles = {
    button: cx(
      'inline-flex items-center justify-center space-x-1.5 font-body font-normal cursor-default focus:outline-none select-none',
      variant.button.default,
      variant.button.states[isDisabled ? 'disabled' : 'enabled'],
    ),
    spinner: variant.spinner,
  }

  const children =
    props.isLoading === true ? (
      <Fragment>
        <ProgressSpinner className={styles.spinner} />
        <span>{props.children}</span>
      </Fragment>
    ) : /* Wrap in span to be able to truncte inside a flex container. */
    typeof props.children === 'string' ? (
      <span className="truncate">{props.children}</span>
    ) : (
      props.children
    )

  return (
    <ElementType {...buttonProps} className={styles.button} ref={ref}>
      {children}
    </ElementType>
  )
}

/**
 * Button.
 */
/* @ts-expect-error Ref vs RefObject */
const _Button = forwardRef(Button)
if (process.env.NODE_ENV !== 'production') {
  _Button.displayName = 'Button'
}
export { _Button as Button }
