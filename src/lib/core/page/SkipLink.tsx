import type { ReactNode } from 'react'

import { Link } from '@/components/common/Link'
import { useSkipToMainContent } from '@/lib/core/page/useSkipToMainContent'

export interface SkipLinkProps {
  children?: ReactNode
}

export function SkipLink(props: SkipLinkProps): JSX.Element {
  const { linkProps } = useSkipToMainContent()

  return (
    <Link {...linkProps} variant="skip-link">
      {props.children}
    </Link>
  )
}
