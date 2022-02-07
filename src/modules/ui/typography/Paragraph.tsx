import cx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'

type ParagraphProps = ComponentPropsWithoutRef<'p'>

export function Paragraph({ children, className, ...props }: ParagraphProps): JSX.Element {
  const classNames = cx('leading-loose', className)

  return (
    <p className={classNames} {...props}>
      {children}
    </p>
  )
}
