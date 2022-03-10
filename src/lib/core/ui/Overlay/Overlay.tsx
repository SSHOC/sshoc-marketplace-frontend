import type { OverlayProps as AriaOverlayProps } from '@react-types/overlays'
import type { ForwardedRef, Ref } from 'react'
import { forwardRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

import { OpenTransition } from '@/lib/core/ui/Overlay/OpenTransition'

export interface OverlayProps extends AriaOverlayProps {
  nodeRef: Ref<HTMLElement>
}

export const Overlay = forwardRef(function Overlay(
  props: OverlayProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const {
    children,
    container,
    isOpen,
    nodeRef,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
  } = props
  const [exited, setExited] = useState(isOpen !== true)

  const handleEntered = useCallback(() => {
    setExited(false)
    if (onEntered) {
      onEntered()
    }
  }, [onEntered])

  const handleExited = useCallback(() => {
    setExited(true)
    if (onExited) {
      onExited()
    }
  }, [onExited])

  const mountOverlay = isOpen === true || !exited
  if (!mountOverlay) {
    return null
  }

  const contents = (
    // TODO: Check if this should be a ModalProvider instead of div
    <div ref={forwardedRef} style={{ background: 'transparent', isolation: 'isolate' }}>
      <OpenTransition
        appear
        in={isOpen}
        nodeRef={nodeRef}
        onEnter={onEnter}
        onEntered={handleEntered}
        onEntering={onEntering}
        onExit={onExit}
        onExited={handleExited}
        onExiting={onExiting}
      >
        {children}
      </OpenTransition>
    </div>
  )

  return createPortal(contents, container || document.body)
})
