import { mergeProps } from '@react-aria/utils'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import cx from 'clsx'
import type { InputHTMLAttributes, RefObject } from 'react'

import type { CheckBoxProps } from '@/elements/CheckBox/CheckBox'
import { Field } from '@/elements/Field/Field'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CheckMarkIcon } from '@/elements/icons/small/checkmark.svg'
import { Svg as DashIcon } from '@/elements/icons/small/dash.svg'
import { RequiredIndicator } from '@/elements/RequiredIndicator/RequiredIndicator'
import { useErrorMessage } from '@/modules/a11y/useErrorMessage'

export interface CheckBoxBaseProps extends CheckBoxProps {
  checkBoxRef: RefObject<HTMLInputElement>
  inputProps: InputHTMLAttributes<HTMLInputElement>
  isDisabled?: boolean
  isSelected?: boolean
  /** @default "default" */
  variant?: 'default' | 'form' | 'facet'
}

/**
 * Base component for CheckBox and CheckBoxGroupItem.
 *
 * @private
 */
export function CheckBoxBase(props: CheckBoxBaseProps): JSX.Element {
  const { fieldProps, errorMessageProps } = useErrorMessage(props)

  const ref = props.checkBoxRef
  const inputProps = props.inputProps
  const isDisabled = props.isDisabled === true
  const isSelected = props.isSelected === true
  const isIndeterminate = props.isIndeterminate === true

  const variant = props.variant ?? 'default'

  const styles = {
    wrapper: cx(
      'inline-flex items-center space-x-2 py-0.5',
      variant === 'facet' && 'hover:bg-gray-90 px-2 rounded',
      isDisabled && 'pointer-events-none',
    ),
    checkBox: cx(
      'w-3.75 h-3.75 p-0.5 flex-shrink-0',
      'rounded inline-flex items-center justify-center border transition text-white focus:outline-none',
      isDisabled ? 'border-gray-350' : 'border-gray-350',
      isSelected
        ? isDisabled
          ? 'bg-gray-350'
          : variant === 'form' || variant === 'facet'
          ? 'bg-secondary-600 border-secondary-600'
          : /** variant === 'default' */
            'bg-primary-750 border-primary-750 hover:bg-secondary-600 hover:border-secondary-600'
        : '',
    ),
    label: cx(
      'inline-flex space-x-1 font-body font-normal text-ui-base select-none',
      isDisabled ? 'text-gray-350' : 'text-gray-800',
      variant === 'facet' && 'flex-1',
    ),
    text: 'flex-1 inline-flex justify-between',
  }

  return (
    <Field
      isDisabled={props.isDisabled}
      isRequired={props.isRequired}
      necessityIndicator={props.necessityIndicator}
      validationState={props.validationState}
      validationMessage={props.validationMessage}
      errorMessageProps={errorMessageProps}
    >
      <label className={styles.wrapper}>
        <span className={styles.checkBox}>
          {isIndeterminate ? (
            <Icon icon={DashIcon} />
          ) : isSelected ? (
            <Icon icon={CheckMarkIcon} />
          ) : null}
        </span>
        {props.children !== undefined ? (
          <span className={styles.label}>
            <span className={styles.text}>{props.children}</span>
            <RequiredIndicator
              isRequired={props.isRequired}
              necessityIndicator={props.necessityIndicator}
            />
          </span>
        ) : null}
        <VisuallyHidden>
          <input {...mergeProps(inputProps, fieldProps)} ref={ref} />
        </VisuallyHidden>
      </label>
    </Field>
  )
}
