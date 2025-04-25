import { useButton } from '@react-aria/button'
import { mergeProps } from '@react-aria/utils'
import type { PressEvents } from '@react-types/shared'
import type { ReactNode } from 'react'
import { Fragment, useRef } from 'react'

import type { CheckBoxGroupProps } from '@/lib/core/ui/CheckBoxGroup/CheckBoxGroup'
import { CheckBoxGroup } from '@/lib/core/ui/CheckBoxGroup/CheckBoxGroup'
import css from '@/lib/core/ui/Facet/Facet.module.css'
import type { DisclosureAria } from '@/lib/core/ui/hooks/useDisclosure'
import { useDisclosure } from '@/lib/core/ui/hooks/useDisclosure'
import type { DisclosureState } from '@/lib/core/ui/hooks/useDisclosureState'
import { useDisclosureState } from '@/lib/core/ui/hooks/useDisclosureState'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import TriangleIcon from '@/lib/core/ui/icons/triangle.svg?symbol-icon'

export interface FacetProps extends CheckBoxGroupProps {
  label: string
  /** @default 3 */
  headingLevel?: 1 | 2 | 3 | 4
  defaultOpen?: boolean
  isOpen?: boolean
  controls?: ReactNode
}

export function Facet(props: FacetProps): JSX.Element {
  const { controls, headingLevel = 3, label, ...checkBoxGroupProps } = props

  const state = useDisclosureState(props)
  const { triggerProps, contentProps } = useDisclosure(state)

  return (
    <FacetDisclosure
      headingLevel={headingLevel}
      label={label}
      state={state}
      triggerProps={triggerProps}
    >
      <Fragment>
        <CheckBoxGroup {...mergeProps(checkBoxGroupProps, contentProps)} variant="facet" />
        {controls != null ? <div className={css['controls']}>{controls}</div> : null}
      </Fragment>
    </FacetDisclosure>
  )
}

export interface FacetDisclosureProps extends Pick<FacetProps, 'headingLevel' | 'label'> {
  children?: ReactNode
  state: DisclosureState
  triggerProps: DisclosureAria['triggerProps']
}

export function FacetDisclosure(props: FacetDisclosureProps): JSX.Element {
  const { children, headingLevel = 3, label, state, triggerProps } = props

  const ElementType = `h${headingLevel}` as const

  return (
    <div className={css['container']} data-state={state.isOpen ? 'expanded' : 'collapsed'}>
      <ElementType className={css['heading']}>
        <DisclosureButton {...triggerProps} onPress={state.toggle}>
          {label}
          <Icon icon={TriangleIcon} />
        </DisclosureButton>
      </ElementType>
      {state.isOpen ? children : null}
    </div>
  )
}

interface DisclosureButtonProps extends PressEvents {
  children?: ReactNode
}

function DisclosureButton(props: DisclosureButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, buttonRef)

  return (
    <button type='button' {...buttonProps} ref={buttonRef} className={css['button']}>
      {props.children}
    </button>
  )
}

export { Item } from '@/lib/core/ui/CheckBoxGroup/CheckBoxGroup'
