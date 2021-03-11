import cx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'

type TitleProps = ComponentPropsWithoutRef<'h1'>

export function Title({
  children,
  className,
  ...props
}: TitleProps): JSX.Element {
  const classNames = cx('font-medium text-3xl leading-9', className)

  return (
    <h1 className={classNames} {...props}>
      {children}
    </h1>
  )
}
