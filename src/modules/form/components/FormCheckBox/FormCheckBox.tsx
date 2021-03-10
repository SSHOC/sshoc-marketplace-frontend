import { mergeProps } from '@react-aria/utils'

import type { CheckBoxProps } from '@/elements/CheckBox/CheckBox'
import { CheckBox } from '@/elements/CheckBox/CheckBox'
import { FormField } from '@/modules/form/FormField'
import { getFormFieldValidationState } from '@/modules/form/getFormFieldValidationState'

export interface FormCheckBoxProps extends CheckBoxProps {
  name: string
}

/**
 * CheckBox form component.
 */
export function FormCheckBox(props: FormCheckBoxProps): JSX.Element {
  return (
    <FormField name={props.name} type="checkbox">
      {({ input, meta }) => {
        return (
          <CheckBox
            {...mergeProps(props, {
              onBlur: input.onBlur,
              onFocus: input.onFocus,
              onChange: input.onChange,
              isSelected: input.checked,
            })}
            {...getFormFieldValidationState(meta)}
          />
        )
      }}
    </FormField>
  )
}
