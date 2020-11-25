import cx from 'clsx'
import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, Ref } from 'react'

type AnchorComponentProps = ComponentPropsWithoutRef<'a'>

function AnchorComponent(
  { className, children, ...props }: AnchorComponentProps,
  ref: Ref<HTMLAnchorElement>,
): JSX.Element {
  return (
    <a
      ref={ref}
      className={cx(
        'text-primary-800 hover:text-primary-700 transition-colors duration-150',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

const Anchor = forwardRef(AnchorComponent)

export { Anchor }
