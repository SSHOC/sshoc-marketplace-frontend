import type { ReactNode } from 'react'

import css from '@/components/common/Alert.module.css'

export interface AlertProps {
  children?: ReactNode
  /** @default 'notice' */
  color?: 'negative' | 'notice' | 'positive'
}

export function Alert(props: AlertProps): JSX.Element {
  const { children, color } = props

  return (
    <div className={css['container']} data-color={color}>
      {children}
    </div>
  )
}
