import { useFocusRing } from '@react-aria/focus'
import { useHover } from '@react-aria/interactions'
import { mergeProps, useObjectRef } from '@react-aria/utils'
import type {
  Alignment,
  LabelableProps,
  LabelPosition,
  NecessityIndicator,
  PressEvents,
} from '@react-types/shared'
import type { AriaTextFieldProps } from '@react-types/textfield'
import type {
  CSSProperties,
  ForwardedRef,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  RefObject,
  TextareaHTMLAttributes,
} from 'react'
import { forwardRef } from 'react'

import { Field } from '@/lib/core/ui/Field/Field'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import AlertIcon from '@/lib/core/ui/icons/alert.svg?symbol-icon'
import CheckmarkIcon from '@/lib/core/ui/icons/checkmark.svg?symbol-icon'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'
import css from '@/lib/core/ui/TextField/TextFieldBase.module.css'

export interface TextFieldBaseStyleProps {
  '--textfield-input-background-color'?: CSSProperties['backgroundColor']
  '--textfield-input-background-color-focus'?: CSSProperties['backgroundColor']
  '--textfield-input-background-color-hover'?: CSSProperties['backgroundColor']
  '--textfield-input-background-color-disabled'?: CSSProperties['backgroundColor']
  '--textfield-input-border-color'?: CSSProperties['borderColor']
  '--textfield-input-border-color-focus'?: CSSProperties['borderColor']
  '--textfield-input-border-color-hover'?: CSSProperties['borderColor']
  '--textfield-input-border-color-disabled'?: CSSProperties['borderColor']
  '--textfield-input-border-width'?: CSSProperties['borderWidth']
  '--textfield-input-border-radius'?: CSSProperties['borderRadius']
  '--textfield-input-color'?: CSSProperties['color']
  '--textfield-input-color-focus'?: CSSProperties['color']
  '--textfield-input-color-hover'?: CSSProperties['color']
  '--textfield-input-color-disabled'?: CSSProperties['color']
  '--textfield-input-placeholder-color'?: CSSProperties['color']
  '--textfield-input-placeholder-color-focus'?: CSSProperties['color']
  '--textfield-input-placeholder-color-hover'?: CSSProperties['color']
  '--textfield-input-placeholder-color-disabled'?: CSSProperties['color']
  '--textfield-input-padding-block'?: CSSProperties['paddingBlock']
  '--textfield-input-padding-inline'?: CSSProperties['paddingInline']
  '--textfield-input-font-size'?: CSSProperties['fontSize']
  '--textfield-input-line-height'?: CSSProperties['lineHeight']
  '--textfield-icon-color'?: CSSProperties['color']
  '--textfield-validation-icon-color'?: CSSProperties['color']
}

export interface TextFieldBaseProps extends AriaTextFieldProps, LabelableProps, PressEvents {
  /** @default 'primary' */
  color?:
    | 'form'
    | 'primary'
    | 'review changed'
    | 'review deleted'
    | 'review inserted'
    | 'review unchanged'
  descriptionProps?: HTMLAttributes<HTMLElement>
  /** @default 'input' */
  elementType?: 'input' | 'textarea'
  errorMessageProps?: HTMLAttributes<HTMLElement>
  icon?: JSX.Element
  inputProps: InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>
  inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement>
  isLoading?: boolean
  isRequired?: boolean
  /** @default 'start' */
  labelAlign?: Alignment
  labelPosition?: LabelPosition
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  loadingIndicator?: JSX.Element
  /** @default 'icon' */
  necessityIndicator?: NecessityIndicator
  rows?: number
  /** @default 'md' */
  size?: 'lg' | 'md' | 'sm'
  style?: TextFieldBaseStyleProps
  wrapperChildren?: Array<JSX.Element> | JSX.Element
}

export const TextFieldBase = forwardRef(function TextFieldBase(
  props: TextFieldBaseProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const defaultLoadingIndicator = <ProgressSpinner size="sm" />

  const {
    color = 'primary',
    descriptionProps,
    elementType: ElementType = 'input',
    errorMessageProps,
    icon,
    inputProps,
    inputRef,
    isLoading,
    labelProps,
    loadingIndicator = defaultLoadingIndicator,
    rows,
    size = 'md',
    style,
    type,
    validationState,
    // TODO: could use less generic name, since it is only used for ClearButton
    wrapperChildren,
  } = props

  const fieldRef = useObjectRef(forwardedRef)
  const textFieldRef = useObjectRef(inputRef)

  const { focusProps, isFocusVisible } = useFocusRing({ ...props, isTextInput: true })
  const { hoverProps, isHovered } = useHover(props)

  const isInvalid = validationState === 'invalid'

  return (
    <Field
      ref={fieldRef}
      {...props}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      labelProps={labelProps}
      showErrorIcon={false}
    >
      <div
        className={css['textfield']}
        data-color={color}
        data-icon={[
          icon != null ? 'left' : undefined,
          wrapperChildren != null ? 'right' : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
        data-loading-state={isLoading === true ? 'loading' : undefined}
        data-size={size}
        data-validation-state={validationState}
        data-focused={isFocusVisible ? '' : undefined}
        data-hovered={isHovered ? '' : undefined}
        style={style as CSSProperties}
      >
        <ElementType
           
          ref={textFieldRef as any}
          {...mergeProps(focusProps, hoverProps, inputProps)}
          className={css['textfield-input']}
          rows={ElementType === 'textarea' ? rows : undefined}
          type={ElementType === 'textarea' ? undefined : type}
          data-focused={isFocusVisible ? '' : undefined}
          data-hovered={isHovered ? '' : undefined}
        />
        {icon != null ? <div className={css['icon-left']}>{icon}</div> : null}
        {isLoading === true ? (
          <div className={css['validation-icon']}>{loadingIndicator}</div>
        ) : validationState ? (
          <div className={css['validation-icon']}>
            <Icon icon={isInvalid ? AlertIcon : CheckmarkIcon} />
          </div>
        ) : null}
        {wrapperChildren != null ? (
          <div className={css['icon-right']}>{wrapperChildren}</div>
        ) : null}
      </div>
    </Field>
  )
})
