import type {
  LabelableProps,
  NecessityIndicator,
  Validation,
} from '@react-types/shared'
import type {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react'

import { ErrorMessage } from '@/elements/ErrorMessage/ErrorMessage'
import { HelpText } from '@/elements/HelpText/HelpText'
import { Label } from '@/elements/Label/Label'
import { SuccessMessage } from '@/elements/SuccessMessage/SuccessMessage'

export interface FieldProps extends LabelableProps, Validation {
  children?: JSX.Element
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  /** @default "label" */
  labelElementType?: ElementType
  isDisabled?: boolean
  /** @default "icon" */
  necessityIndicator?: NecessityIndicator
  validationMessage?: ReactNode
  helpText?: ReactNode
  errorMessageProps?: HTMLAttributes<HTMLElement>
  isReadOnly?: boolean
  style?: CSSProperties
}

/**
 * Provides label and error message to form field.
 */
export function Field(props: FieldProps): JSX.Element {
  const styles = {
    field: 'min-w-0 inline-flex flex-col space-y-1.5',
  }

  if (props.label === undefined && props.validationState === undefined) {
    return (
      <div
        className={styles.field}
        style={{ ...props.style, textDecoration: 'none' }}
      >
        {props.children}
      </div>
    )
  }

  return (
    <div
      className={styles.field}
      style={{ ...props.style, textDecoration: 'none' }}
    >
      {props.label !== undefined ? (
        <Label
          {...props.labelProps}
          elementType={props.labelElementType}
          isDisabled={props.isDisabled}
          isRequired={props.isRequired}
          necessityIndicator={props.necessityIndicator}
          isReadOnly={props.isReadOnly}
        >
          {props.label}
        </Label>
      ) : null}
      {props.children}
      {props.validationState === 'invalid' &&
      props.validationMessage !== undefined ? (
        <ErrorMessage {...props.errorMessageProps}>
          {props.validationMessage}
        </ErrorMessage>
      ) : props.validationState === 'valid' &&
        props.validationMessage !== undefined ? (
        <SuccessMessage>{props.validationMessage}</SuccessMessage>
      ) : props.helpText !== undefined ? (
        <HelpText>{props.helpText}</HelpText>
      ) : null}
    </div>
  )
}
