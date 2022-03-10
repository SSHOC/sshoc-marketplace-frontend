import type { ReactNode } from 'react'

import css from '@/components/common/SearchResult.module.css'

export interface SearchResultProps {
  children?: ReactNode
}

export function SearchResult(props: SearchResultProps): JSX.Element {
  const { children } = props

  return <article className={css['search-result']}>{children}</article>
}
