import cx from 'clsx'
import type { Ref } from 'react'
import type { PropsWithAs } from '@/utils/ts/as'
import { forwardRefWithAs } from '@/utils/ts/as'

type VStackLayoutLayoutProps = PropsWithAs<unknown, 'div'>

function VStackLayout(
  { as: Type = 'div', children, className, ...props }: VStackLayoutLayoutProps,
  ref: Ref<HTMLDivElement>,
): JSX.Element {
  const classNames = cx('flex flex-col', className)

  return (
    <Type ref={ref} className={classNames} {...props}>
      {children}
    </Type>
  )
}

/**
 * Horizontal stack.
 */
const VStack = forwardRefWithAs<unknown, 'div'>(VStackLayout)

export default VStack
