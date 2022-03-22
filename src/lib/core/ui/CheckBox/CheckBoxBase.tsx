import { useFocusRing } from '@react-aria/focus'
import { useHover } from '@react-aria/interactions'
import { mergeProps } from '@react-aria/utils'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import type { ForwardedRef, InputHTMLAttributes, RefObject } from 'react'
import { forwardRef, useRef } from 'react'
import useComposedRef from 'use-composed-ref'

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
  const {
    inputProps,
    isDisabled = false,
    isSelected = false,
    isIndeterminate = false,
    variant = 'primary',
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const ref = useComposedRef(inputRef, forwardedRef)

  const { hoverProps, isHovered } = useHover(props)
  const { focusProps, isFocusVisible } = useFocusRing({ ...props, within: true })

  return (
    <Field {...props}>
      <label
        {...mergeProps(focusProps, hoverProps)}
        className={css['container']}
        data-hovered={isHovered ? '' : undefined}
        data-focused={isFocusVisible ? '' : undefined}
        data-variant={variant}
      >
        <span
          className={css['check-box']}
          data-state={isDisabled ? 'disabled' : isSelected ? 'selected' : undefined}
        >
          {isIndeterminate ? (
            <Icon icon={DashIcon} />
          ) : isSelected ? (
            <Icon icon={CheckMarkIcon} />
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
          <input ref={ref} {...inputProps} />
        </VisuallyHidden>
      </label>
    </Field>
  )
})
