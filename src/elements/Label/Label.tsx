import type { DOMProps, NecessityIndicator } from '@react-types/shared'
import cx from 'clsx'
import type { ElementType, LabelHTMLAttributes, ReactNode } from 'react'

import { RequiredIndicator } from '@/elements/RequiredIndicator/RequiredIndicator'

export interface LabelProps
  extends DOMProps,
    LabelHTMLAttributes<HTMLLabelElement> {
  children?: ReactNode
  /** @default "label" */
  elementType?: ElementType
  isDisabled?: boolean
  isRequired?: boolean
  /** @default "icon" */
  necessityIndicator?: NecessityIndicator
  isReadOnly?: boolean
}

/**
 * Label for form fields.
 */
export function Label(props: LabelProps): JSX.Element {
  const {
    children,
    elementType: ElementType = 'label',
    isDisabled,
    isRequired,
    isReadOnly,
    necessityIndicator,
    ...labelProps
  } = props

  const styles = {
    label: cx(
      'font-body font-normal text-ui-base text-gray-800 inline-flex space-x-1 select-none cursor-default',
      isDisabled === true && 'pointer-events-none',
      isReadOnly === true && 'pointer-events-none',
    ),
  }

  return (
    <ElementType {...labelProps} className={styles.label}>
      <span>{children}</span>
      <RequiredIndicator
        isRequired={isRequired}
        necessityIndicator={necessityIndicator}
      />
    </ElementType>
  )
}
