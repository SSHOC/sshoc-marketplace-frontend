import cx from 'clsx'
import type { Ref } from 'react'

import styles from '@/modules/layout/FullWidth.module.css'
import type { PropsWithAs } from '@/utils/ts/as'
import { forwardRefWithAs } from '@/utils/ts/as'

type FullWidthLayoutProps = PropsWithAs<unknown, 'section'>

function FullWidthLayout(
  { as: Type = 'section', children, className, ...props }: FullWidthLayoutProps,
  ref: Ref<HTMLElement>,
): JSX.Element {
  const classNames = cx(styles.layout, className)

  return (
    <Type ref={ref} className={classNames} {...props}>
      {children}
    </Type>
  )
}

/**
 * Wide layout without margins. Must be nested inside a `GridLayout`.
 */
const FullWidth = forwardRefWithAs<unknown, 'section'>(FullWidthLayout)

export default FullWidth
