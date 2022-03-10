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

export interface DateFieldProps extends AriaTextFieldProps, LabelableProps {
  /** @default 'primary' */
  color?: 'form' | 'primary'
  icon?: JSX.Element
  isRequired?: boolean
  /** @default 'start' */
  labelAlign?: Alignment
  labelPosition?: LabelPosition
  /** @default 'icon' */
  necessityIndicator?: NecessityIndicator
  /** @default 'md' */
  size?: 'lg' | 'md' | 'sm'
  style?: TextFieldBaseStyleProps
}

export const DateField = forwardRef(function DateField(
  props: DateFieldProps,
  forwardedRef: ForwardedRef<HTMLInputElement>,
): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(
    props,
    inputRef,
  )

  return (
    <TextFieldBase
      ref={forwardedRef}
      {...props}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      inputProps={inputProps}
      inputRef={inputRef}
      labelProps={labelProps}
      type="date"
    />
  )
})
