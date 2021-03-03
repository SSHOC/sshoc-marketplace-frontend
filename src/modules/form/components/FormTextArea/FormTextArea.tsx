import { mergeProps } from '@react-aria/utils'

import type { TextAreaProps } from '@/elements/TextArea/TextArea'
import { TextArea } from '@/elements/TextArea/TextArea'
import { FormField } from '@/modules/form/FormField'
import { getFormFieldValidationState } from '@/modules/form/getFormFieldValidationState'

export interface FormTextAreaProps extends TextAreaProps {
  name: string
}

/**
 * TextArea form component.
 */
export function FormTextArea(props: FormTextAreaProps): JSX.Element {
  return (
    <FormField name={props.name}>
      {({ input, meta }) => {
        return (
          <TextArea
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