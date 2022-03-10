import { mergeProps } from '@react-aria/utils'
import { useField } from 'react-final-form'

import { useFormFieldValidationState } from '@/lib/core/form/useFormFieldValidationState'
import type { TextFieldProps } from '@/lib/core/ui/TextField/TextField'
import { TextField } from '@/lib/core/ui/TextField/TextField'

export interface FormTextFieldProps extends Omit<TextFieldProps, 'value'> {
  name: string
}

export function FormTextField(props: FormTextFieldProps): JSX.Element {
  const { input, meta } = useField(props.name)
  const validation = useFormFieldValidationState(meta)

  return (
    <TextField
      color="form"
      {...mergeProps(props, {
        onBlur: input.onBlur,
        onFocus: input.onFocus,
        onChange: input.onChange,
        value: input.value,
        ...validation,
      })}
    />
  )
}
