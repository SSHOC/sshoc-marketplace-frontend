import type { ReactNode } from 'react'

import css from '@/components/common/ScreenHeader.module.css'

export interface ScreenHeaderProps {
  children?: ReactNode
}

export function ScreenHeader(props: ScreenHeaderProps): JSX.Element {
  return <header className={css['container']}>{props.children}</header>
}
