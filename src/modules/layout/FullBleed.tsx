import cx from 'clsx'
import type { Ref } from 'react'
import styles from '@/modules/layout/FullBleed.module.css'
import type { PropsWithAs } from '@/utils/ts/as'
import { forwardRefWithAs } from '@/utils/ts/as'

type FullBleedLayoutProps = PropsWithAs<unknown, 'section'>

function FullBleedLayout(
  { as: Type = 'section', children, className, ...props }: FullBleedLayoutProps,
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
 * Full bleed layout. Must be nested inside a `GridLayout`.
 */
const FullBleed = forwardRefWithAs<unknown, 'section'>(FullBleedLayout)

export default FullBleed
