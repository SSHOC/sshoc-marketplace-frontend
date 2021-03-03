import { mergeProps } from '@react-aria/utils'

import type { CheckBoxGroupProps } from '@/elements/CheckBoxGroup/CheckBoxGroup'
import { CheckBoxGroup } from '@/elements/CheckBoxGroup/CheckBoxGroup'
import { FormField } from '@/modules/form/FormField'
import { getFormFieldValidationState } from '@/modules/form/getFormFieldValidationState'

export interface FormCheckBoxGroupProps extends CheckBoxGroupProps {
  name: string
}

/**
 * CheckBox Group form component.
 */
export function FormCheckBoxGroup(props: FormCheckBoxGroupProps): JSX.Element {
  return (
    <FormField name={props.name}>
      {({ input, meta }) => {
        return (
          <CheckBoxGroup
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

FormCheckBoxGroup.Item = CheckBoxGroup.Item
