import type { ReactNode } from 'react'

import css from '@/components/home/SubSectionHeader.module.css'

export interface SubSectionHeaderProps {
  children?: ReactNode
}

export function SubSectionHeader(props: SubSectionHeaderProps): JSX.Element {
  return <div className={css['container']}>{props.children}</div>
}
