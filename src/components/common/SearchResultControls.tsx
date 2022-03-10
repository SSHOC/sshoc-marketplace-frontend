import type { ReactNode } from 'react'

import css from '@/components/common/SearchResultControls.module.css'

export interface SearchResultControlsProps {
  children?: ReactNode
}

export function SearchResultControls(props: SearchResultControlsProps): JSX.Element {
  const { children } = props

  return <div className={css['container']}>{children}</div>
}
