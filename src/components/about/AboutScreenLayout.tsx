import type { ReactNode } from 'react'

import css from '@/components/about/AboutScreenLayout.module.css'

export interface AboutScreenLayoutProps {
  children?: ReactNode
}

export function AboutScreenLayout(props: AboutScreenLayoutProps): JSX.Element {
  return <div className={css['layout']}>{props.children}</div>
}
