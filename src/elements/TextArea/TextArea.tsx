import { useTextField } from '@react-aria/textfield'
import type { NecessityIndicator } from '@react-types/shared'
import type { AriaTextFieldProps } from '@react-types/textfield'
import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { useRef } from 'react'

import { TextFieldBase } from '@/elements/TextFieldBase/TextFieldBase'

export interface TextAreaProps extends AriaTextFieldProps {
  /** @default "default" */
  variant?: 'default' | 'form'
  /** @default "md" */
  size?: 'md' | 'lg'
  necessityIndicator?: NecessityIndicator
  validationMessage?: ReactNode
  helpText?: ReactNode
  rows?: number
}

/**
 * Text area.
 */
export function TextArea(props: TextAreaProps): JSX.Element {
  const ref = useRef<HTMLTextAreaElement>(null)
  const { labelProps, inputProps } = useTextField(
    { ...props, inputElementType: 'textarea' },
    ref,
  )

  return (
    <TextFieldBase
      {...props}
      textFieldRef={ref}
      inputElementType="textarea"
      labelProps={labelProps}
      inputProps={
        {
          ...inputProps,
          rows: props.rows,
        } as TextareaHTMLAttributes<HTMLTextAreaElement>
      }
    />
  )
}
