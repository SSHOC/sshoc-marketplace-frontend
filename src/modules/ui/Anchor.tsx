import cx from 'clsx'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import { forwardRef } from 'react'

type AnchorComponentProps = ComponentPropsWithoutRef<'a'>

function AnchorComponent(
  { className, children, ...props }: AnchorComponentProps,
  ref: Ref<HTMLAnchorElement>,
): JSX.Element {
  return (
    <a
      ref={ref}
      className={cx(
        'text-primary-750 hover:text-secondary-600 transition-colors duration-150',
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
