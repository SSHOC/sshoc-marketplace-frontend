import type { HelpTextProps as AriaHelpTextProps, Validation } from '@react-types/shared'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, Fragment } from 'react'

import css from '@/lib/core/ui/HelpText/HelpText.module.css'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import AlertIcon from '@/lib/core/ui/icons/alert.svg?symbol-icon'

export interface HelpTextProps extends AriaHelpTextProps, Validation {
  descriptionProps?: HTMLAttributes<HTMLElement>
  errorMessageProps?: HTMLAttributes<HTMLElement>
  isDisabled?: boolean
  showErrorIcon?: boolean
}

export const HelpText = forwardRef(function HelpText(
  props: HelpTextProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const {
    description,
    errorMessage,
    validationState,
    isDisabled,
    showErrorIcon,
    descriptionProps,
    errorMessageProps,
  } = props
  const isErrorMessage = errorMessage != null && validationState === 'invalid'

  return (
    <div
      ref={forwardedRef}
      className={css['help-text']}
      data-disabled={isDisabled === true ? '' : undefined}
      data-validation-state={validationState}
    >
      {isErrorMessage ? (
        <Fragment>
          {showErrorIcon === true ? <Icon icon={AlertIcon} /> : null}
          <div {...errorMessageProps}>{errorMessage}</div>
        </Fragment>
      ) : (
        <div {...descriptionProps}>{description}</div>
      )}
    </div>
  )
})
