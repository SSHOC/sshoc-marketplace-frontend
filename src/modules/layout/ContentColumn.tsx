import cx from 'clsx'
import type { Ref } from 'react'

import styles from '@/modules/layout/ContentColumn.module.css'
import type { PropsWithAs } from '@/utils/ts/as'
import { forwardRefWithAs } from '@/utils/ts/as'

type ContentColumnLayoutProps = PropsWithAs<unknown, 'section'>

function ContentColumnLayout(
  {
    as: Type = 'section',
    children,
    className,
    ...props
  }: ContentColumnLayoutProps,
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
 * Wide layout with margins. Must be nested inside a `GridLayout`.
 */
const ContentColumn = forwardRefWithAs<unknown, 'section'>(ContentColumnLayout)

export default ContentColumn
