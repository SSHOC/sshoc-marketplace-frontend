import type { ReactNode } from 'react'

import css from '@/components/common/FormFieldArray.module.css'

export interface FormFieldArrayProps {
  children?: ReactNode
}

export function FormFieldArray(props: FormFieldArrayProps): JSX.Element {
  const { children } = props

  return <div className={css['container']}>{children}</div>
}
