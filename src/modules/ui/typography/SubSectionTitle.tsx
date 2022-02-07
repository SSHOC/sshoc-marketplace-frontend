import cx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'

type SubSectionTitleProps = ComponentPropsWithoutRef<'h3'> & {
  as?: 'div' | 'h2' | 'h3' | 'h4'
}

export function SubSectionTitle({
  as: Type = 'h3',
  children,
  className,
  ...props
}: SubSectionTitleProps): JSX.Element {
  const classNames = cx('font-medium text-xl leading-tight', className)

  return (
    <Type className={classNames} {...props}>
      {children}
    </Type>
  )
}
