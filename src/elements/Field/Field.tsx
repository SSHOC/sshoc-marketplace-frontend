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
import { Fragment } from 'react'

import { ErrorMessage } from '@/elements/ErrorMessage/ErrorMessage'
import { Label } from '@/elements/Label/Label'

export interface FieldProps extends LabelableProps, Validation {
  children?: JSX.Element
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  /** @default "label" */
  labelElementType?: ElementType
  isDisabled?: boolean
  /** @default "icon" */
  necessityIndicator?: NecessityIndicator
  validationMessage?: ReactNode
  errorMessageProps?: HTMLAttributes<HTMLElement>
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
      <div className={styles.field} style={props.style}>
        {props.children}
      </div>
    )
  }

  return (
    <div className={styles.field} style={props.style}>
      {props.label !== undefined ? (
        <Label
          {...props.labelProps}
          elementType={props.labelElementType}
          isDisabled={props.isDisabled}
          isRequired={props.isRequired}
          necessityIndicator={props.necessityIndicator}
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
      ) : null}
    </div>
  )
}
