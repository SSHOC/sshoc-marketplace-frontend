import { mergeProps } from '@react-aria/utils'
import type { CSSProperties } from 'react'

import type { ComboBoxProps } from '@/elements/ComboBox/ComboBox'
import { ComboBox } from '@/elements/ComboBox/ComboBox'
import { FormField } from '@/modules/form/FormField'
import { getFormFieldValidationState } from '@/modules/form/getFormFieldValidationState'

export interface FormComboBoxProps<T> extends ComboBoxProps<T> {
  name: string
  style?: CSSProperties
}

/**
 * ComboBox form component.
 *
 * Initial values must only be set via `Form`, not
 * with `defaultSelectedKey` on the combobox component.
 */
export function FormComboBox<T>(props: FormComboBoxProps<T>): JSX.Element {
  return (
    <FormField name={props.name}>
      {({ input, meta }) => {
        return (
          /* @ts-expect-error HTMLElement vs Element generic. */
          <ComboBox
            {...mergeProps(props, {
              onBlur: input.onBlur,
              onFocus: input.onFocus,
              onSelectionChange: input.onChange,
              selectedKey: input.value,
            })}
            {...getFormFieldValidationState(meta)}
            showSelectedItemIndicator
          />
        )
      }}
    </FormField>
  )
}

FormComboBox.Item = ComboBox.Item

FormComboBox.Section = ComboBox.Section

FormComboBox.Separator = ComboBox.Separator
