import type { ReactNode } from 'react'

import css from '@/lib/core/page/PageMainContent.module.css'

import { useSkipToMainContent } from './useSkipToMainContent'

export interface PageMainContentProps {
  children?: ReactNode
}

export function PageMainContent(props: PageMainContentProps): JSX.Element {
  const { targetProps } = useSkipToMainContent()

  return (
    <main className={css['container']} {...targetProps}>
      {props.children}
    </main>
  )
}
