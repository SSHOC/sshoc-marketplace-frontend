import type { HTMLAttributes } from 'react'

import css from '@/lib/core/ui/Overlay/Underlay.module.css'

export interface UnderlayProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

export function Underlay(props: UnderlayProps): JSX.Element {
  const { isOpen, ...domProps } = props

  return <div {...domProps} className={css['underlay']} data-open={isOpen} />
}
