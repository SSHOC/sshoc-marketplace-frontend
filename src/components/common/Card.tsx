import type { ReactNode } from 'react'

import css from '@/components/common/Card.module.css'

export interface CardProps {
  children?: ReactNode
}

export function Card(props: CardProps): JSX.Element {
  return <div className={css['container']}>{props.children}</div>
}
