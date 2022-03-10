import { useObjectRef } from '@react-aria/utils'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import type { ForwardedRef, InputHTMLAttributes, RefObject } from 'react'
import { forwardRef } from 'react'

import type { CheckBoxProps } from '@/lib/core/ui/CheckBox/CheckBox'
import css from '@/lib/core/ui/CheckBox/CheckBoxBase.module.css'
import { Field } from '@/lib/core/ui/Field/Field'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import CheckMarkIcon from '@/lib/core/ui/icons/checkmark.svg?symbol-icon'
import DashIcon from '@/lib/core/ui/icons/dash.svg?symbol-icon'
import { RequiredIndicator } from '@/lib/core/ui/RequiredIndicator/RequiredIndicator'

export interface CheckBoxBaseProps extends CheckBoxProps {
  checkBoxRef: RefObject<HTMLInputElement>
  inputProps: InputHTMLAttributes<HTMLInputElement>
  isDisabled?: boolean
  isSelected?: boolean
  /** @default 'primary */
  variant?: 'facet' | 'primary'
}

export const CheckBoxBase = forwardRef(function CheckBoxBase(
  props: CheckBoxBaseProps,
  forwardedRef: ForwardedRef<HTMLInputElement>,
): JSX.Element {
  const ref = useObjectRef(forwardedRef)

  const inputProps = props.inputProps
  const isDisabled = props.isDisabled === true
  const isSelected = props.isSelected === true
  const isIndeterminate = props.isIndeterminate === true

  const variant = props.variant ?? 'primary'

  return (
    <Field {...props}>
      <label className={css['container']} data-variant={variant}>
        <span
          className={css['check-box']}
          data-state={isDisabled ? 'disabled' : isSelected ? 'selected' : undefined}
        >
          {isIndeterminate ? (
            <Icon icon={DashIcon} className="icon" />
          ) : isSelected ? (
            <Icon icon={CheckMarkIcon} className="icon" />
          ) : null}
        </span>
        {props.children != null ? (
          <span className={css['label']} data-variant={variant}>
            <span className={css['text']}>{props.children}</span>
            <RequiredIndicator
              isRequired={props.isRequired}
              necessityIndicator={props.necessityIndicator}
            />
          </span>
        ) : null}
        <VisuallyHidden>
          <input {...inputProps} ref={ref} />
        </VisuallyHidden>
      </label>
    </Field>
  )
})
