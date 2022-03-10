import { useTextField } from '@react-aria/textfield'
import type {
  Alignment,
  LabelableProps,
  LabelPosition,
  NecessityIndicator,
} from '@react-types/shared'
import type { AriaTextFieldProps } from '@react-types/textfield'
import type { ForwardedRef } from 'react'
import { forwardRef, useRef } from 'react'

import type { TextFieldBaseStyleProps } from '@/lib/core/ui/TextField/TextFieldBase'
import { TextFieldBase } from '@/lib/core/ui/TextField/TextFieldBase'

export interface TextAreaProps extends Omit<AriaTextFieldProps, 'type'>, LabelableProps {
  /** @default 'primary' */
  color?:
    | 'form'
    | 'primary'
    | 'review changed'
    | 'review deleted'
    | 'review inserted'
    | 'review unchanged'
  icon?: JSX.Element
  isRequired?: boolean
  /** @default 'start' */
  labelAlign?: Alignment
  labelPosition?: LabelPosition
  /** @default 'icon' */
  necessityIndicator?: NecessityIndicator
  rows?: number
  /** @default 'md' */
  size?: 'lg' | 'md' | 'sm'
  style?: TextFieldBaseStyleProps
}

export const TextArea = forwardRef(function TextArea(
  props: TextAreaProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { descriptionProps, errorMessageProps, inputProps, labelProps } = useTextField<'textarea'>(
    props,
    inputRef,
  )

  return (
    <TextFieldBase
      ref={forwardedRef}
      {...props}
      descriptionProps={descriptionProps}
      elementType="textarea"
      errorMessageProps={errorMessageProps}
      inputProps={inputProps}
      inputRef={inputRef}
      labelProps={labelProps}
    />
  )
})
