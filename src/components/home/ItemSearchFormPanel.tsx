import type { ReactNode } from 'react'

import css from '@/components/home/ItemSearchFormPanel.module.css'

export interface ItemSearchFormPanelProps {
  children?: ReactNode
}

export function ItemSearchFormPanel(props: ItemSearchFormPanelProps): JSX.Element {
  return <div className={css['container']}>{props.children}</div>
}
