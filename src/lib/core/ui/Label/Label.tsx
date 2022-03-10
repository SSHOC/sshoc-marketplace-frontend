import type { LabelProps as AriaLabelProps } from '@react-types/label'
import type { Alignment, DOMProps, LabelPosition, NecessityIndicator } from '@react-types/shared'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'

import css from '@/lib/core/ui/Label/Label.module.css'
import { RequiredIndicator } from '@/lib/core/ui/RequiredIndicator/RequiredIndicator'

export interface LabelProps extends AriaLabelProps, DOMProps {
  includeNecessityIndicatorInAccessibilityName?: boolean
  isRequired?: boolean
  /** @default 'start' */
  labelAlign?: Alignment
  /** @default 'top' */
  labelPosition?: LabelPosition
  /** @default 'icon' */
  necessityIndicator?: NecessityIndicator
}

export const Label = forwardRef(function Label(
  props: LabelProps,
  forwardedRef: ForwardedRef<HTMLLabelElement>,
): JSX.Element {
  const {
    children,
    elementType: ElementType = 'label',
    htmlFor,
    includeNecessityIndicatorInAccessibilityName,
    isRequired,
    labelAlign = props.labelPosition === 'side' ? 'start' : null,
    labelPosition = 'top',
    necessityIndicator,
    onClick, // FIXME: why do we need this?
  } = props

  return (
    <ElementType
      ref={forwardedRef}
      className={css['label']}
      htmlFor={ElementType === 'label' ? htmlFor : undefined}
      onClick={onClick}
    >
      {children}
      <RequiredIndicator
        isRequired={isRequired}
        necessityIndicator={necessityIndicator}
        includeNecessityIndicatorInAccessibilityName={includeNecessityIndicatorInAccessibilityName}
      />
    </ElementType>
  )
})
