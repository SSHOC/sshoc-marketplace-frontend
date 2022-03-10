import { useFocusRing } from '@react-aria/focus'
import { useHover } from '@react-aria/interactions'
import type { AriaLinkOptions as AriaLinkProps } from '@react-aria/link'
import { useLink } from '@react-aria/link'
import { mergeProps } from '@react-aria/utils'
import type {
  CSSProperties,
  ElementType,
  ForwardedRef,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react'
import { forwardRef, useRef } from 'react'
import useComposedRef from 'use-composed-ref'

import css from '@/lib/core/ui/Link/Link.module.css'

export interface LinkStyleProps {
  '--link-color'?: CSSProperties['color']
  '--link-color-focus'?: CSSProperties['color']
  '--link-color-hover'?: CSSProperties['color']
  '--link-color-active'?: CSSProperties['color']
  '--link-color-disabled'?: CSSProperties['color']
  '--link-text-decoration'?: CSSProperties['textDecoration']
  '--link-cursor'?: CSSProperties['cursor']
}

export interface LinkProps extends AriaLinkProps {
  'aria-current'?: HTMLAttributes<HTMLAnchorElement>['aria-current']
  children?: ReactNode
  href?: string
  /** Used by `next/link` for preloading. */
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>
  rel?: string
  /** Necessary for menu links. */
  role?: string
  style?: LinkStyleProps
  /** Necessary for menu links. */
  tabIndex?: number
  target?: string
  /** @default 'primary' */
  variant?:
    | 'breadcrumb'
    | 'heading'
    | 'nav-link-footer'
    | 'nav-link-header'
    | 'nav-menu-link'
    | 'nav-mobile-menu-link-secondary'
    | 'nav-mobile-menu-link'
    | 'pagination'
    | 'primary'
    | 'skip-link'
    | 'tag'
    | 'text'
}

export const Link = forwardRef(function Link(
  props: LinkProps,
  forwardedRef: ForwardedRef<HTMLAnchorElement>,
): JSX.Element {
  const {
    'aria-current': ariaCurrent,
    children,
    elementType: ElementType = 'a' as ElementType,
    href,
    onMouseEnter,
    rel,
    role,
    style,
    tabIndex,
    target,
    variant, // = 'primary'
  } = props

  const linkRef = useRef<HTMLAnchorElement>(null)
  const ref = useComposedRef(linkRef, forwardedRef)
  const { linkProps, isPressed } = useLink(props, linkRef)
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props)
  const { hoverProps, isHovered } = useHover(props)

  return (
    <ElementType
      ref={ref}
      {...mergeProps(linkProps, focusProps, hoverProps)}
      aria-current={ariaCurrent}
      className={css['link']}
      data-active={isPressed ? '' : undefined}
      data-focused={isFocusVisible ? '' : undefined}
      data-hovered={isHovered ? '' : undefined}
      data-variant={variant}
      href={href}
      onMouseEnter={onMouseEnter}
      rel={rel}
      role={role}
      style={style as CSSProperties}
      tabIndex={tabIndex}
      target={target}
    >
      {children}
    </ElementType>
  )
})
