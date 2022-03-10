import type { ReactNode } from 'react'

import css from '@/components/item-form/ItemFormScreenLayout.module.css'

export interface ItemFormScreenLayoutProps {
  children?: ReactNode
}

export function ItemFormScreenLayout(props: ItemFormScreenLayoutProps): JSX.Element {
  return <div className={css['layout']}>{props.children}</div>
}
