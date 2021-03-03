import { mergeProps } from '@react-aria/utils'
import cx from 'clsx'
import type {
  CSSProperties,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  RefObject,
  TextareaHTMLAttributes,
} from 'react'

import { Field } from '@/elements/Field/Field'
import type { TextAreaProps } from '@/elements/TextArea/TextArea'
import type { TextFieldProps } from '@/elements/TextField/TextField'
import { useErrorMessage } from '@/modules/a11y/useErrorMessage'

interface TextFieldBaseProps extends TextFieldProps {
  textFieldRef: RefObject<HTMLInputElement>
  inputElementType: 'input'
  labelProps: LabelHTMLAttributes<HTMLLabelElement>
  inputProps: InputHTMLAttributes<HTMLInputElement>
  style?: CSSProperties
}

interface TextAreaBaseProps extends TextAreaProps {
  textFieldRef: RefObject<HTMLTextAreaElement>
  inputElementType: 'textarea'
  labelProps: LabelHTMLAttributes<HTMLLabelElement>
  inputProps: TextareaHTMLAttributes<HTMLTextAreaElement>
  style?: CSSProperties
}

/**
 * Base component for TextField and TextArea.
 *
 * @private
 */
export function TextFieldBase(
  props: TextFieldBaseProps | TextAreaBaseProps,
): JSX.Element {
  const { fieldProps, errorMessageProps } = useErrorMessage(props)

  const ref = props.textFieldRef
  const { inputProps, labelProps } = props
  const ElementType = props.inputElementType

  const validationState = props.validationState
  const isDisabled = props.isDisabled === true

  const variants = {
    default: {
      textField: {
        default:
          'text-base px-4 py-2 rounded placeholder-gray-350 border border-gray-300 focus:border-secondary-600 hover:bg-gray-75 hover:border-gray-350',
        states: {
          enabled: 'text-gray-800',
          disabled: 'pointer-events-none bg-gray-100 text-gray-500',
          invalid: '',
          valid: '',
        },
      },
    },
    form: {
      textField: {
        default:
          'text-ui-base px-4 py-3 rounded bg-gray-75 border border-gray-300 placeholder-gray-350 focus:bg-highlight-75 focus:border-secondary-600 focus:placeholder-highlight-300 hover:border-secondary-600 hover:bg-white',
        states: {
          enabled: 'text-gray-800',
          disabled: 'pointer-events-none bg-gray-100 text-gray-500',
          invalid: '',
          valid: '',
        },
      },
    },
  }

  const variant = variants[props.variant ?? 'default']
  const styles = {
    textField: cx(
      'font-body font-normal transition focus:outline-none',
      variant.textField.default,
      validationState !== undefined &&
        variant.textField.states[validationState],
      variant.textField.states[isDisabled ? 'disabled' : 'enabled'],
    ),
  }

  return (
    <Field
      label={props.label}
      labelProps={labelProps}
      isDisabled={isDisabled}
      isRequired={props.isRequired}
      necessityIndicator={props.necessityIndicator}
      validationState={props.validationState}
      validationMessage={props.validationMessage}
      errorMessageProps={errorMessageProps}
      style={props.style}
    >
      <ElementType
        {...mergeProps(inputProps, fieldProps)}
        className={styles.textField}
        /* @ts-expect-error Overloaded ref. */
        ref={ref}
      />
    </Field>
  )
}
