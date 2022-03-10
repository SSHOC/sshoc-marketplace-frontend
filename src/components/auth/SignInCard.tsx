import type { ReactNode } from 'react'

import css from '@/components/auth/SignInCard.module.css'
import { Card } from '@/components/common/Card'

export interface SignInCardProps {
  children?: ReactNode
}

export function SignInCard(props: SignInCardProps): JSX.Element {
  return (
    <div className={css['container']}>
      <Card>{props.children}</Card>
    </div>
  )
}
