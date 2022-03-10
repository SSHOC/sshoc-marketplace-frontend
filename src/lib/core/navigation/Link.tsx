import type { LinkProps as NextLinkProps } from 'next/link'
import NextLink from 'next/link'
import type { ReactNode } from 'react'

import type { Href } from '@/lib/core/navigation/types'
import type { Locale } from '~/config/i18n.config.mjs'

export interface LinkProps extends Omit<NextLinkProps, 'as' | 'href' | 'locale'> {
  href: Href
  locale?: Locale | false
  children?: ReactNode
}

export function Link(props: LinkProps): JSX.Element {
  return <NextLink {...props} />
}
