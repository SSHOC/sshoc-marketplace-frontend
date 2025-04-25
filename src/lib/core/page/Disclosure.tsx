import { useButton } from '@react-aria/button'
import { useObjectRef } from '@react-aria/utils'
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, Fragment } from 'react'

import { useDisclosure } from '@/lib/core/ui/hooks/useDisclosure'
import { useDisclosureState } from '@/lib/core/ui/hooks/useDisclosureState'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import TriangleIcon from '@/lib/core/ui/icons/triangle.svg?symbol-icon'

export interface DisclosureProps {
  label: string
  children?: ReactNode
  // FIXME: make trigger button separate component
  className?: string
}

export const Disclosure = forwardRef(function Disclosure(
  props: DisclosureProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const state = useDisclosureState(props)
  // FIXME: ref for what? also solved by using separate components for button and content
  const buttonRef = useObjectRef(forwardedRef)
  const { triggerProps, contentProps } = useDisclosure(state)
  const { buttonProps } = useButton(
    {
      ...(triggerProps as any),
      onPress() {
        state.toggle()
      },
    },
    buttonRef,
  )

  return (
    <Fragment>
      <button
        type='button'
        {...buttonProps}
        className={props.className}
        data-state={state.isOpen ? 'expanded' : 'collapsed'}
      >
        <span>{props.label}</span>
        <Icon icon={TriangleIcon} />
      </button>
      {state.isOpen ? <div {...contentProps}>{props.children}</div> : null}
    </Fragment>
  )
})
