import type { ReactNode } from 'react'

import css from '@/components/common/MetadataLabel.module.css'

export interface MetadataLabelProps {
  children?: ReactNode
  /** @default 'md' */
  size?: 'md' | 'sm' | 'xs'
}

export function MetadataLabel(props: MetadataLabelProps): JSX.Element {
  const { children, size = 'md' } = props

  return (
    <span className={css['text']} data-size={size}>
      {children}
    </span>
  )
}
