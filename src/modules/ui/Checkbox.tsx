import VisuallyHidden from '@reach/visually-hidden'
import cx from 'clsx'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import { ChangeEvent, forwardRef, useState } from 'react'
import CheckMark from '@/modules/ui/CheckMark'

function CheckboxComponent(
  { children, value, defaultChecked, name }: ComponentPropsWithoutRef<'input'>,
  ref: Ref<HTMLInputElement>,
) {
  const [checked, setChecked] = useState(defaultChecked)

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setChecked(event.currentTarget.checked)
  }

  return (
    <label className="flex items-center">
      <VisuallyHidden>
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          onChange={onChange}
          value={value}
          ref={ref}
        />
      </VisuallyHidden>
      <div className="flex items-center space-x-3">
        <div
          className={cx(
            'w-5 h-5 border rounded inline-flex justify-center items-center flex-shrink-0',
            checked === true
              ? 'border-secondary-600 text-white bg-secondary-600'
              : 'border-gray-500',
          )}
        >
          {checked === true ? <CheckMark /> : null}
        </div>
        <span>{children}</span>
      </div>
    </label>
  )
}

/**
 * Uncontrolled checkbox.
 */
const Checkbox = forwardRef(CheckboxComponent)

export default Checkbox
