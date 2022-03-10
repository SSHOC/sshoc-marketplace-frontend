import type { ReactNode } from 'react'

import css from '@/components/common/FormFieldList.module.css'

export interface FormFieldListProps {
  children?: ReactNode
  /** @default 'primary' */
  variant?: 'primary' | 'thumbnails'
}

export function FormFieldList(props: FormFieldListProps): JSX.Element {
  const { children, variant = 'primary' } = props

  return (
    <ol role="list" className={css['list']} data-variant={variant}>
      {children}
    </ol>
  )
}
