import type { ReactNode } from 'react'

import css from '@/components/common/Prose.module.css'

export interface ProseProps {
  children?: ReactNode
  html?: string
}

export function Prose(props: ProseProps): JSX.Element {
  if (props.html != null) {
    return <div className={css['container']} dangerouslySetInnerHTML={{ __html: props.html }} />
  }

  return <div className={css['container']}>{props.children}</div>
}
