import type { ReactNode, Ref } from 'react'
import { Children, cloneElement, isValidElement } from 'react'
import { Transition } from 'react-transition-group'
import type { TransitionActions, TransitionProps } from 'react-transition-group/Transition'

export type { TransitionStatus } from 'react-transition-group'

const OPEN_STATES = {
  entered: true,
  entering: false,
  exited: false,
  exiting: true,
  unmounted: false,
}

// const timeout = { enter: 0, exit: 350 }
const timeout = { enter: 0, exit: 0 } // FIXME:

export interface OpenTransitionProps
  extends Pick<
      TransitionProps,
      'in' | 'onEnter' | 'onEntered' | 'onEntering' | 'onExit' | 'onExited' | 'onExiting'
    >,
    Pick<TransitionActions, 'appear'> {
  children: ReactNode
  nodeRef: Ref<HTMLElement>
}

export function OpenTransition(props: OpenTransitionProps): JSX.Element {
  const { children, nodeRef } = props

  return (
    <Transition
      {...props}
      // addEndListener={(done) => {
      //   if (nodeRef?.current != null) {
      //     nodeRef.current.addEventListener('transitionend', done, false)
      //     nodeRef.current.addEventListener('animationend', done, false)
      //   }
      // }}
      nodeRef={nodeRef}
      timeout={timeout}
    >
      {(state) => {
        return Children.map(children, (child) => {
          if (!isValidElement(child)) {return null}

          return cloneElement(child, { isOpen: OPEN_STATES[state], transitionState: state })
        })
      }}
    </Transition>
  )
}
