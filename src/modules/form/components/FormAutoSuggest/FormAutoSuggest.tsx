import { mergeProps } from '@react-aria/utils'

import type { ComboBoxProps } from '@/elements/ComboBox/ComboBox'
import { ComboBox } from '@/elements/ComboBox/ComboBox'
import { FormField } from '@/modules/form/FormField'
import { getFormFieldValidationState } from '@/modules/form/getFormFieldValidationState'

export interface FormAutoSuggestProps<T> extends ComboBoxProps<T> {
  name: string
}

/**
 * Autosuggest form component.
 *
 * Wraps a ComboBox with `allowsCustomValue`, but manages the input
 * value, not the selected key, as component state. Not that a
 * `ComboBox` by default submits the `inputValue` on native form
 * submit events, but since form values are managed by `final-form`
 * this needs to be wired up explicitly.
 *
 * Initial values must only be set via `Form`, not
 * with `defaultInputValue` on the combobox component.
 */
export function FormAutoSuggest<T>(
  props: FormAutoSuggestProps<T>,
): JSX.Element {
  return (
    <FormField name={props.name}>
      {({ input, meta }) => {
        return (
          /* @ts-expect-error HTMLElement vs Element generic. */
          <ComboBox
            variant="form"
            allowsCustomValue
            type="search"
            {...mergeProps(props, {
              onBlur: input.onBlur,
              onFocus: input.onFocus,
              onInputChange: input.onChange,
              inputValue: input.value,
            })}
            {...getFormFieldValidationState(meta)}
          />
        )
      }}
    </FormField>
  )
}

FormAutoSuggest.Item = ComboBox.Item

FormAutoSuggest.Section = ComboBox.Section

FormAutoSuggest.Separator = ComboBox.Separator
