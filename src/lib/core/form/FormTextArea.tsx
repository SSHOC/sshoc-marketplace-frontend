import { mergeProps } from '@react-aria/utils'
import { useField } from 'react-final-form'

import { useFormFieldValidationState } from '@/lib/core/form/useFormFieldValidationState'
import type { TextAreaProps } from '@/lib/core/ui/TextField/TextArea'
import { TextArea } from '@/lib/core/ui/TextField/TextArea'

export interface FormTextAreaProps extends Omit<TextAreaProps, 'value'> {
  name: string
}

export function FormTextArea(props: FormTextAreaProps): JSX.Element {
  const { input, meta } = useField(props.name)
  const validation = useFormFieldValidationState(meta)

  return (
    <TextArea
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
