import type { ReactNode } from 'react'

import css from '@/components/common/FormSectionTitle.module.css'

export interface FormSectionTitleProps {
  children?: ReactNode
  /** @default 3 */
  headingLevel?: 3 | 4 | 5
}
export function FormSectionTitle(props: FormSectionTitleProps): JSX.Element {
  const { children, headingLevel = 3 } = props

  const ElementType = `h${headingLevel}` as const

  return <ElementType className={css['heading']}>{children}</ElementType>
}
