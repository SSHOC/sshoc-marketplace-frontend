import { useButton } from '@react-aria/button'
import { useFocusRing } from '@react-aria/focus'
import { useHover } from '@react-aria/interactions'
import { mergeProps, useObjectRef } from '@react-aria/utils'
import type { ButtonProps } from '@react-types/button'
import type { DOMProps, ValidationState } from '@react-types/shared'
import type { CSSProperties, ForwardedRef } from 'react'
import { forwardRef } from 'react'

import css from '@/lib/core/ui/FieldButton/FieldButton.module.css'

export interface FieldButtonStyleProps {
  '--field-button-width'?: CSSProperties['width']
  '--field-button-height'?: CSSProperties['height']
  '--field-button-border-radius'?: CSSProperties['borderRadius']
  '--field-button-background-color'?: CSSProperties['backgroundColor']
  '--field-button-background-color-focus'?: CSSProperties['backgroundColor']
  '--field-button-background-color-hover'?: CSSProperties['backgroundColor']
  '--field-button-background-color-active'?: CSSProperties['backgroundColor']
  '--field-button-background-color-disabled'?: CSSProperties['backgroundColor']
  '--field-button-border-color'?: CSSProperties['borderColor']
  '--field-button-border-color-focus'?: CSSProperties['borderColor']
  '--field-button-border-color-hover'?: CSSProperties['borderColor']
  '--field-button-border-color-active'?: CSSProperties['borderColor']
  '--field-button-border-color-disabled'?: CSSProperties['borderColor']
  '--field-button-border-width'?: CSSProperties['borderWidth']
  '--field-button-color'?: CSSProperties['color']
  '--field-button-color-focus'?: CSSProperties['color']
  '--field-button-color-hover'?: CSSProperties['color']
  '--field-button-color-active'?: CSSProperties['color']
  '--field-button-color-disabled'?: CSSProperties['color']
  '--field-button-padding-inline'?: CSSProperties['paddingInline']
  '--field-button-padding-block'?: CSSProperties['paddingBlock']
  '--field-button-font-size'?: CSSProperties['fontSize']
  '--field-button-font-weight'?: CSSProperties['fontWeight']
  '--field-button-line-height'?: CSSProperties['lineHeight']
}

export interface FieldButtonProps extends ButtonProps, DOMProps {
  /** @default 'primary' */
  color?: 'form' | 'primary'
  isActive?: boolean
  preventFocusOnPress?: boolean
  style?: FieldButtonStyleProps
  validationState?: ValidationState
}

export const FieldButton = forwardRef(function FieldButton(
  props: FieldButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const { children, color = 'primary', isActive = false, style, validationState } = props

  const ref = useObjectRef(forwardedRef)
  const { buttonProps, isPressed } = useButton(props, ref)
  const { hoverProps, isHovered } = useHover(props)
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props)

  return (
    <button
      ref={ref}
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      className={css['button']}
      data-color={color}
      data-active={isActive === true || isPressed === true ? '' : undefined}
      data-focused={isFocusVisible ? '' : undefined}
      data-hovered={isHovered ? '' : undefined}
      data-validation-state={validationState}
      style={style as CSSProperties}
    >
      {children}
    </button>
  )
})
