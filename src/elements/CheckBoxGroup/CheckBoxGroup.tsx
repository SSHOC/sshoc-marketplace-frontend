import { useCheckboxGroup, useCheckboxGroupItem } from '@react-aria/checkbox'
import { mergeProps } from '@react-aria/utils'
import type { CheckboxGroupState } from '@react-stately/checkbox'
import { useCheckboxGroupState } from '@react-stately/checkbox'
import type { AriaCheckboxGroupItemProps, AriaCheckboxGroupProps } from '@react-types/checkbox'
import type { NecessityIndicator, Validation } from '@react-types/shared'
import type { ReactElement, ReactNode } from 'react'
import { Children, cloneElement, useRef } from 'react'

import { CheckBoxBase } from '@/elements/CheckBoxBase/CheckBoxBase'
import { Field } from '@/elements/Field/Field'
import { useErrorMessage } from '@/modules/a11y/useErrorMessage'

export interface CheckBoxGroupProps extends AriaCheckboxGroupProps, Validation {
  children: Array<ReactElement<CheckBoxGroupItemProps>> | ReactElement<CheckBoxGroupItemProps>
  necessityIndicator?: NecessityIndicator
  validationMessage?: ReactNode
  /** @default "default" */
  variant?: 'default' | 'facet' | 'form'
}

/**
 * CheckBox group.
 */
export function CheckBoxGroup(props: CheckBoxGroupProps): JSX.Element {
  const state = useCheckboxGroupState(props)
  const { groupProps, labelProps } = useCheckboxGroup(props, state)
  const { errorMessageProps, fieldProps } = useErrorMessage(props)

  const variant = props.variant ?? 'default'

  const styles = {
    group: 'flex flex-col space-y-1',
  }

  return (
    <Field
      labelElementType="span"
      labelProps={labelProps}
      label={props.label}
      isDisabled={props.isDisabled}
      isRequired={props.isRequired}
      necessityIndicator={props.necessityIndicator}
      validationState={props.validationState}
      validationMessage={props.validationMessage}
      errorMessageProps={errorMessageProps}
    >
      <div {...mergeProps(groupProps, fieldProps)} className={styles.group}>
        {Children.map(props.children, (child) => {
          return cloneElement(child, { state, variant })
        })}
      </div>
    </Field>
  )
}

interface CheckBoxGroupItemProps extends AriaCheckboxGroupItemProps {
  state?: CheckboxGroupState
  /** @default "default" */
  variant?: 'default' | 'facet' | 'form'
}

/**
 * CheckBox group item.
 *
 * Used as `CheckBoxGroup.Item`.
 *
 * @private
 */
function CheckBoxGroupItem(props: CheckBoxGroupItemProps): JSX.Element {
  const ref = useRef<HTMLInputElement>(null)

  const state = props.state!
  const { inputProps } = useCheckboxGroupItem(props, state, ref)
  const isDisabled = props.isDisabled === true || state.isDisabled === true
  const isSelected = state.isSelected(props.value)

  const variant = props.variant ?? 'default'

  return (
    <CheckBoxBase
      {...props}
      checkBoxRef={ref}
      inputProps={inputProps}
      isDisabled={isDisabled}
      isSelected={isSelected}
      variant={variant}
    />
  )
}

CheckBoxGroup.Item = CheckBoxGroupItem
