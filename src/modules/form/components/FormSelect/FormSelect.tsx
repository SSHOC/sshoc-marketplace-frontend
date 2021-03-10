import { mergeProps } from '@react-aria/utils'
import type { CSSProperties } from 'react'

import type { SelectProps } from '@/elements/Select/Select'
import { Select } from '@/elements/Select/Select'
import { FormField } from '@/modules/form/FormField'
import { getFormFieldValidationState } from '@/modules/form/getFormFieldValidationState'

export interface FormSelectProps<T> extends SelectProps<T> {
  name: string
  style?: CSSProperties
}

/**
 * Select form component.
 */
export function FormSelect<T>(props: FormSelectProps<T>): JSX.Element {
  return (
    <FormField name={props.name}>
      {({ input, meta }) => {
        return (
          /* @ts-expect-error HTMLElement vs Element generic. */
          <Select
            {...mergeProps(props, {
              onBlur: input.onBlur,
              onFocus: input.onFocus,
              onSelectionChange: input.onChange,
              selectedKey: input.value,
            })}
            {...getFormFieldValidationState(meta)}
          />
        )
      }}
    </FormField>
  )
}

FormSelect.Item = Select.Item

FormSelect.Section = Select.Section

FormSelect.Separator = Select.Separator
