import cx from 'clsx'
import type { Ref } from 'react'
import type { PropsWithAs } from '@/utils/ts/as'
import { forwardRefWithAs } from '@/utils/ts/as'

type TextFieldComponentProps = PropsWithAs<unknown, 'input'>

function TextFieldComponent(
  {
    as: Type = 'input',
    children,
    className,
    ...props
  }: TextFieldComponentProps,
  ref: Ref<HTMLInputElement>,
): JSX.Element {
  const classNames = cx(
    'border border-gray-200 rounded p-3 bg-gray-50 shadow-none',
    props['aria-invalid'] === true && 'border-red-600',
    className,
  )

  return (
    <Type ref={ref} className={classNames} {...props}>
      {children}
    </Type>
  )
}

const TextField = forwardRefWithAs<unknown, 'input'>(TextFieldComponent)

export default TextField
