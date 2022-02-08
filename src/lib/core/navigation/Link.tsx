import type { LinkProps as NextLinkProps } from 'next/link'
import NextLink from 'next/link'
import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'

import type { Href } from '@/lib/core/navigation/types'

export interface LinkProps
  extends Omit<ComponentPropsWithoutRef<'a'>, 'href'>,
    Omit<NextLinkProps, 'as' | 'href' | 'locale' | 'passHref'> {
  href: Href
  isDisabled?: boolean
  children?: ReactNode
}

export const Link = forwardRef(function Link(
  props: LinkProps,
  forwardedRef: ForwardedRef<HTMLAnchorElement>,
): JSX.Element {
  const { href, replace, scroll, shallow, prefetch, isDisabled, ...anchorProps } = props

  /** `NextLink` types currently don't work well with `exactOptionalPropertyTypes`. */
  const linkProps = { replace, scroll, shallow, prefetch } as Partial<
    Pick<LinkProps, 'prefetch' | 'replace' | 'scroll' | 'shallow'>
  >

  /**
   * @see https://www.scottohara.me/blog/2021/05/28/disabled-links.html
   */
  if (isDisabled === true) {
    return (
      <a
        {...anchorProps}
        role="link"
        aria-disabled
        ref={forwardedRef}
        style={{ pointerEvents: 'none' }}
      >
        {props.children}
      </a>
    )
  }

  return (
    <NextLink href={href} {...linkProps}>
      <a {...anchorProps} ref={forwardedRef}>
        {props.children}
      </a>
    </NextLink>
  )
})
