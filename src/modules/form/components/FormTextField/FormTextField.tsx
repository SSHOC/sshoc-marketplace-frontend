import { mergeProps } from '@react-aria/utils'

import { CSSProperties } from 'react'
import type { TextFieldProps } from '@/elements/TextField/TextField'
import { TextField } from '@/elements/TextField/TextField'
import { FormField } from '@/modules/form/FormField'
import { getFormFieldValidationState } from '@/modules/form/getFormFieldValidationState'

export interface FormTextFieldProps extends TextFieldProps {
  name: string
  style?: CSSProperties
}

/**
 * TextField form component.
 */
export function FormTextField(props: FormTextFieldProps): JSX.Element {
  return (
    <FormField name={props.name}>
      {({ input, meta }) => {
        return (
          <TextField
            {...mergeProps(props, {
              onBlur: input.onBlur,
              onFocus: input.onFocus,
              onChange: input.onChange,
              defaultValue: meta.initial,
            })}
            {...getFormFieldValidationState(meta)}
          />
        )
      }}
    </FormField>
  )
}