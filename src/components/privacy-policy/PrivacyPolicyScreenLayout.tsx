import type { ReactNode } from 'react'

import css from '@/components/privacy-policy/PrivacyPolicyScreenLayout.module.css'

export interface PrivacyPolicyScreenLayoutProps {
  children?: ReactNode
}

export function PrivacyPolicyScreenLayout(props: PrivacyPolicyScreenLayoutProps): JSX.Element {
  return <div className={css['layout']}>{props.children}</div>
}
