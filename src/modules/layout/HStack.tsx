import cx from 'clsx'
import type { Ref } from 'react'
import type { PropsWithAs } from '@/utils/ts/as'
import { forwardRefWithAs } from '@/utils/ts/as'

type HStackLayoutLayoutProps = PropsWithAs<unknown, 'div'>

function HStackLayout(
  { as: Type = 'div', children, className, ...props }: HStackLayoutLayoutProps,
  ref: Ref<HTMLDivElement>,
): JSX.Element {
  const classNames = cx('flex', className)

  return (
    <Type ref={ref} className={classNames} {...props}>
      {children}
    </Type>
  )
}

/**
 * Horizontal stack.
 */
const HStack = forwardRefWithAs<unknown, 'div'>(HStackLayout)

export default HStack
