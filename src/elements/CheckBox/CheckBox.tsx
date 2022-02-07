import { useCheckbox } from '@react-aria/checkbox'
import { useToggleState } from '@react-stately/toggle'
import type { AriaCheckboxProps } from '@react-types/checkbox'
import type { NecessityIndicator } from '@react-types/shared'
import type { ReactNode } from 'react'
import { useRef } from 'react'

import { CheckBoxBase } from '@/elements/CheckBoxBase/CheckBoxBase'

export interface CheckBoxProps extends AriaCheckboxProps {
  validationMessage?: ReactNode
  necessityIndicator?: NecessityIndicator
  /** @default "default" */
  variant?: 'default' | 'facet' | 'form'
}

/**
 * CheckBox.
 */
export function CheckBox(props: CheckBoxProps): JSX.Element {
  const ref = useRef<HTMLInputElement>(null)
  const state = useToggleState(props)
  const { inputProps } = useCheckbox(props, state, ref)
  const isDisabled = props.isDisabled === true
  const isSelected = state.isSelected

  return (
    <CheckBoxBase
      {...props}
      checkBoxRef={ref}
      inputProps={inputProps}
      isDisabled={isDisabled}
      isSelected={isSelected}
    />
  )
}
