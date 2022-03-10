import type { ReactNode } from 'react'

import css from '@/components/common/FormFieldArrayControls.module.css'

export interface FormFieldArrayControlsProps {
  children?: ReactNode
}

export function FormFieldArrayControls(props: FormFieldArrayControlsProps): JSX.Element {
  const { children } = props

  return <div className={css['container']}>{children}</div>
}
