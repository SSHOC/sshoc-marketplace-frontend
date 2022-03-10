import type { ReactNode } from 'react'

import css from '@/components/browse/BrowseScreenLayout.module.css'

export interface BrowseScreenLayoutProps {
  children?: ReactNode
}

export function BrowseScreenLayout(props: BrowseScreenLayoutProps): JSX.Element {
  return <div className={css['layout']}>{props.children}</div>
}
