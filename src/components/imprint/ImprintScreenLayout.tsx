import type { ReactNode } from 'react'

import css from '@/components/imprint/ImprintScreenLayout.module.css'

export interface ImprintScreenLayoutProps {
  children?: ReactNode
}

export function ImprintScreenLayout(props: ImprintScreenLayoutProps): JSX.Element {
  return <div className={css['layout']}>{props.children}</div>
}
