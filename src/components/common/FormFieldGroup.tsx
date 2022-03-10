import type { ReactNode } from 'react'

import css from '@/components/common/FormFieldGroup.module.css'

export interface FormFieldGroupProps {
  children?: ReactNode
}

export function FormFieldGroup(props: FormFieldGroupProps): JSX.Element {
  const { children } = props

  return (
    <div role="group" className={css['container']}>
      {children}
    </div>
  )
}
