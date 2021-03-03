import { useId } from '@react-aria/utils'
import type { ValidationState } from '@react-types/shared'
import type { ReactNode } from 'react'

export type AriaErrorMessageProps = {
  validationMessage?: ReactNode
  validationState?: ValidationState
}

export type AriaErrorMessage = {
  fieldProps: {
    // 'aria-errormessage'?: string
    'aria-describedby'?: string
  }
  errorMessageProps: {
    id?: string
  }
}

/**
 * Associates an error message with a form field.
 */
export function useErrorMessage(
  props: AriaErrorMessageProps,
): AriaErrorMessage {
  const id = useId()

  if (
    props.validationMessage === undefined ||
    props.validationState !== 'invalid'
  ) {
    return {
      fieldProps: {},
      errorMessageProps: {},
    }
  }

  return {
    fieldProps: {
      // 'aria-errormessage': id,
      /**
       * Currently, `aria-errormessage` is not very well supported,
       * so we fall back on `aria-describedby`.
       */
      'aria-describedby': id,
    },
    errorMessageProps: {
      id,
    },
  }
}
