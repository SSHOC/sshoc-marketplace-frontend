import { mergeProps } from '@react-aria/utils'
import { useField } from 'react-final-form'

import { useFormFieldValidationState } from '@/lib/core/form/useFormFieldValidationState'
import type { FileInputProps } from '@/lib/core/ui/FileInput/FileInput'
import { FileInput } from '@/lib/core/ui/FileInput/FileInput'

export interface FormFileInputProps extends Omit<FileInputProps, 'value'> {
  name: string
}

export function FormFileInput(props: FormFileInputProps): JSX.Element {
  const { input, meta } = useField(props.name)
  const validation = useFormFieldValidationState(meta)

  return (
    <FileInput
      color="gradient"
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
