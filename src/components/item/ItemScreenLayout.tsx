import type { ReactNode } from 'react'

import css from '@/components/item/ItemScreenLayout.module.css'

export interface ItemScreenLayoutProps {
  children?: ReactNode
}

export function ItemScreenLayout(props: ItemScreenLayoutProps): JSX.Element {
  return <div className={css['layout']}>{props.children}</div>
}
