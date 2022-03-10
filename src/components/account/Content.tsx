import type { ReactNode } from 'react'

import css from '@/components/account/Content.module.css'

export interface ContentProps {
  children?: ReactNode
}

export function Content(props: ContentProps): JSX.Element {
  const { children } = props

  return <div className={css['content']}>{children}</div>
}
