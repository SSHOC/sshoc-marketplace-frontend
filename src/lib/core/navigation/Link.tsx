import type { LinkProps as NextLinkProps } from 'next/link'
import NextLink from 'next/link'
import type { ReactNode } from 'react'

import type { Locale } from '~/config/i18n.config.mjs'

export interface LinkProps extends Omit<NextLinkProps, 'as' | 'locale'> {
  locale?: Locale | false
  children?: ReactNode
}

export function Link(props: LinkProps): JSX.Element {
  return <NextLink legacyBehavior {...props} />
}
