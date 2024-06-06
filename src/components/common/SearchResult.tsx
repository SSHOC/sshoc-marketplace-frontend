import type { CSSProperties, ReactNode } from 'react'

import css from '@/components/common/SearchResult.module.css'

export interface SearchResultProps {
  children?: ReactNode
  style?: CSSProperties
}

export function SearchResult(props: SearchResultProps): JSX.Element {
  const { children, style } = props

  return (
    <article className={css['search-result']} style={style}>
      {children}
    </article>
  )
}
