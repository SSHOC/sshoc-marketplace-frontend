import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'

import type { LinkProps as WrapperProps } from '@/lib/core/navigation/Link'
import { Link as Wrapper } from '@/lib/core/navigation/Link'
import type { LinkButtonProps as AnchorProps } from '@/lib/core/ui/Link/LinkButton'
import { LinkButton as Anchor } from '@/lib/core/ui/Link/LinkButton'

export interface LinkButtonProps
  extends Omit<AnchorProps, 'href'>,
    Omit<WrapperProps, 'passHref'> {}

export const LinkButton = forwardRef(function LinkButton(
  props: LinkButtonProps,
  forwardedRef: ForwardedRef<HTMLAnchorElement>,
): JSX.Element {
  const { href, replace, scroll, shallow, prefetch, locale, children, ...anchorProps } = props

  /** `NextLink` types currently don't work well with `exactOptionalPropertyTypes`. */
  const wrapperProps = { replace, scroll, shallow, prefetch, locale } as Partial<
    Pick<LinkButtonProps, 'locale' | 'prefetch' | 'replace' | 'scroll' | 'shallow'>
  >

  return (
    <Wrapper {...wrapperProps} href={href} passHref>
      <Anchor ref={forwardedRef} {...anchorProps}>
        {children}
      </Anchor>
    </Wrapper>
  )
})
