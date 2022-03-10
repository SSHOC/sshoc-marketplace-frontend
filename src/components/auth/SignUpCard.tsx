import type { ReactNode } from 'react'

import css from '@/components/auth/SignUpCard.module.css'
import { Card } from '@/components/common/Card'

export interface SignUpCardProps {
  children?: ReactNode
}

export function SignUpCard(props: SignUpCardProps): JSX.Element {
  return (
    <div className={css['container']}>
      <Card>{props.children}</Card>
    </div>
  )
}
