import { useButton } from '@react-aria/button'
import { useFocusRing } from '@react-aria/focus'
import { useHover } from '@react-aria/interactions'
import { mergeProps } from '@react-aria/utils'
import type { AriaButtonProps } from '@react-types/button'
import type { CSSProperties, ElementType, ForwardedRef, Ref } from 'react'
import { forwardRef, useRef } from 'react'
import useComposedRef from 'use-composed-ref'

import { useI18n } from '@/lib/core/i18n/useI18n'
import css from '@/lib/core/ui/ClearButton/ClearButton.module.css'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import CrossIcon from '@/lib/core/ui/icons/cross.svg?symbol-icon'

export interface ClearButtonStyleProps {
  '--clear-button-width'?: CSSProperties['width']
  '--clear-button-height'?: CSSProperties['height']
  '--clear-button-color'?: CSSProperties['color']
}

export interface ClearButtonProps<T extends ElementType = 'button'> extends AriaButtonProps<T> {
  preventFocus?: boolean
  style?: ClearButtonStyleProps
}

export const ClearButton = forwardRef(function ClearButton<T extends ElementType = 'button'>(
  props: ClearButtonProps<T>,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const defaultIcon = <Icon icon={CrossIcon} width="0.5em" />

  const { t } = useI18n<'common'>()

  const {
    'aria-label': ariaLabel = t(['common', 'ui', 'clear']),
    children = defaultIcon,
    preventFocus = false,
    style,
  } = props

  const ElementType = preventFocus ? 'div' : 'button'

  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps, isPressed } = useButton(
    { ...props, 'aria-label': ariaLabel, elementType: ElementType },
    buttonRef,
  )
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props)
  const { hoverProps, isHovered } = useHover(props)

  if (preventFocus) {
    delete buttonProps.tabIndex
  }

  const ref = useComposedRef(buttonRef, forwardedRef)

  return (
    <ElementType
      ref={ref as Ref<any>}
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      className={css['clear-button']}
      data-active={isPressed === true ? '' : undefined}
      data-focused={isFocusVisible === true ? '' : undefined}
      data-hovered={isHovered === true ? '' : undefined}
      style={style as CSSProperties}
    >
      {children}
    </ElementType>
  )
}) as <T extends ElementType = 'button'>(
  props: ClearButtonProps<T> & { ref?: ForwardedRef<HTMLElement> },
) => JSX.Element
