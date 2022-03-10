import { useButton } from '@react-aria/button'
import { useFocusRing } from '@react-aria/focus'
import { useHover } from '@react-aria/interactions'
import { mergeProps } from '@react-aria/utils'
import type { AriaButtonProps } from '@react-types/button'
import cx from 'clsx'
import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useRef } from 'react'
import useComposedRef from 'use-composed-ref'

import buttonCss from '@/lib/core/ui/Button/Button.module.css'
import type { LinkProps } from '@/lib/core/ui/Link/Link'
import css from '@/lib/core/ui/Link/Link.module.css'

export interface ButtonLinkProps extends AriaButtonProps<'button'>, Pick<LinkProps, 'style'> {
  children: ReactNode
  form?: string
  isPressed?: boolean
  trigger?: 'collapsed' | 'expanded'
}

export const ButtonLink = forwardRef(function ButtonLink(
  props: ButtonLinkProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const { children, isPressed = false, style, trigger } = props

  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps, isPressed: isActive } = useButton(props, buttonRef)
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props)
  const { hoverProps, isHovered } = useHover(props)

  const ref = useComposedRef(buttonRef, forwardedRef)

  return (
    <button
      ref={ref}
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      className={cx(css['link'], buttonCss['button-link'])}
      data-active={isPressed || isActive ? '' : undefined}
      data-focused={isFocusVisible ? '' : undefined}
      data-hovered={isHovered ? '' : undefined}
      data-trigger={trigger}
      style={style as CSSProperties}
    >
      {children}
    </button>
  )
})
