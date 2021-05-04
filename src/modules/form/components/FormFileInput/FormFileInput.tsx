import { mergeProps } from '@react-aria/utils'
import type { CSSProperties } from 'react'

import type { FileInputProps } from '@/elements/FileInput/FileInput'
import { FileInput } from '@/elements/FileInput/FileInput'
import { FormField } from '@/modules/form/FormField'
import { getFormFieldValidationState } from '@/modules/form/getFormFieldValidationState'

export interface FormFileInputProps extends FileInputProps {
  name: string
  style?: CSSProperties
}

/**
 * FileInput form component.
 */
export function FormFileInput(props: FormFileInputProps): JSX.Element {
  return (
    <FormField name={props.name}>
      {({ input, meta }) => {
        return (
          <FileInput
            {...mergeProps(props, {
              onBlur: input.onBlur,
              onFocus: input.onFocus,
              onChange: input.onChange,
              value: input.value,
            })}
            {...getFormFieldValidationState(meta)}
          />
        )
      }}
    </FormField>
  )
}
