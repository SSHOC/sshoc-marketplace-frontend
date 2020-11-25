import cx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'

type SectionTitleProps = ComponentPropsWithoutRef<'h2'>

export function SectionTitle({
  children,
  className,
  ...props
}: SectionTitleProps): JSX.Element {
  const classNames = cx('font-medium text-2xl', className)

  return (
    <h2 className={classNames} {...props}>
      {children}
    </h2>
  )
}
