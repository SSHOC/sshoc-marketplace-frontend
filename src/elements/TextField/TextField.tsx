import { useTextField } from '@react-aria/textfield'
import type { NecessityIndicator } from '@react-types/shared'
import type { AriaTextFieldProps } from '@react-types/textfield'
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'
import { useRef } from 'react'

import { TextFieldBase } from '@/elements/TextFieldBase/TextFieldBase'

export interface TextFieldProps extends AriaTextFieldProps {
  /** @default "default" */
  variant?: 'default' | 'form' | 'form-diff'
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg'
  necessityIndicator?: NecessityIndicator
  validationMessage?: ReactNode
  helpText?: ReactNode
  style?: CSSProperties
}

/**
 * Text input field.
 */
export function TextField(props: TextFieldProps): JSX.Element {
  const ref = useRef<HTMLInputElement>(null)
  const { labelProps, inputProps } = useTextField(props, ref)

  return (
    <TextFieldBase
      {...props}
      textFieldRef={ref}
      inputElementType="input"
      labelProps={labelProps}
      inputProps={inputProps as InputHTMLAttributes<HTMLInputElement>}
    />
  )
}
