import { useFocusRing } from '@react-aria/focus'
import { useHover } from '@react-aria/interactions'
import type { AriaLinkOptions as AriaLinkProps } from '@react-aria/link'
import { useLink } from '@react-aria/link'
import { mergeProps } from '@react-aria/utils'
import cx from 'clsx'
import type {
  CSSProperties,
  ForwardedRef,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react'
import { forwardRef, useRef } from 'react'
import useComposedRef from 'use-composed-ref'

import type { ButtonProps } from '@/lib/core/ui/Button/Button'
import css from '@/lib/core/ui/Button/Button.module.css'
import linkStyles from '@/lib/core/ui/Link/Link.module.css'

export interface LinkButtonProps
  extends AriaLinkProps,
    Pick<ButtonProps, 'color' | 'size' | 'style' | 'variant'> {
  'aria-current'?: HTMLAttributes<HTMLAnchorElement>['aria-current']
  children?: ReactNode
  href?: string
  /** Used by `next/link` for preloading. */
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>
  rel?: string
  target?: string
}

export const LinkButton = forwardRef(function LinkButton(
  props: LinkButtonProps,
  forwardedRef: ForwardedRef<HTMLAnchorElement>,
): JSX.Element {
  const {
    'aria-current': ariaCurrent,
    color = 'primary',
    children,
    href,
    onMouseEnter,
    rel,
    size = 'md',
    style,
    target,
    variant = 'fill',
  } = props

  const linkRef = useRef<HTMLAnchorElement>(null)
  const ref = useComposedRef(linkRef, forwardedRef)
  const { linkProps, isPressed } = useLink(props, linkRef)
  const { focusProps, isFocusVisible } = useFocusRing(props)
  const { hoverProps, isHovered } = useHover(props)

  return (
    <a
      ref={ref}
      {...mergeProps(linkProps, focusProps, hoverProps)}
      aria-current={ariaCurrent}
      className={cx(css['button'], linkStyles['link-button'])}
      data-color={color}
      data-active={isPressed ? '' : undefined}
      data-focused={isFocusVisible ? '' : undefined}
      data-hovered={isHovered ? '' : undefined}
      data-size={size}
      data-variant={variant}
      href={href}
      onMouseEnter={onMouseEnter}
      rel={rel}
      style={style as CSSProperties}
      target={target}
    >
      {children}
    </a>
  )
})
