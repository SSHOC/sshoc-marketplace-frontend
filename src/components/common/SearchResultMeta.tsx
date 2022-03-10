import type { ReactNode } from 'react'

import css from '@/components/common/SearchResultMeta.module.css'

export interface SearchResultMetaProps {
  children?: ReactNode
}

export function SearchResultMeta(props: SearchResultMetaProps): JSX.Element {
  const { children } = props

  return <div className={css['meta']}>{children}</div>
}
