import { useModal, useOverlay, usePreventScroll } from '@react-aria/overlays'
import { mergeProps, useObjectRef, useViewportSize } from '@react-aria/utils'
import type { TrayProps } from '@react-types/overlays'
import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'

import { Overlay } from '@/lib/core/ui/Overlay/Overlay'
import { Underlay } from '@/lib/core/ui/Overlay/Underlay'
import css from '@/lib/core/ui/Tray/Tray.module.css'

interface TrayWrapperProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  isFixedHeight?: boolean
  isNonModal?: boolean
  isOpen?: boolean
  onClose?: () => void
  overlayProps: HTMLAttributes<HTMLElement>
}

export const Tray = forwardRef(function Tray(
  props: TrayProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const { children, isFixedHeight, isNonModal, onClose, ...otherProps } = props

  const { overlayProps, underlayProps } = useOverlay(
    { ...props, isDismissable: true },
    forwardedRef,
  )

  return (
    <Overlay {...otherProps} nodeRef={forwardedRef}>
      <Underlay {...underlayProps} />
      <TrayWrapper
        ref={forwardedRef}
        isFixedHeight={isFixedHeight}
        isNonModal={isNonModal}
        onClose={onClose}
        overlayProps={overlayProps}
      >
        {children}
      </TrayWrapper>
    </Overlay>
  )
})

const TrayWrapper = forwardRef(function TrayWrapper(
  props: TrayWrapperProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const { children, isOpen, isNonModal, overlayProps, ...otherProps } = props

  const ref = useObjectRef(forwardedRef)

  usePreventScroll()
  const { modalProps } = useModal({
    isDisabled: isNonModal,
  })

  // We need to measure the window's height in JS rather than using percentages in CSS
  // so that contents (e.g. menu) can inherit the max-height properly. Using percentages
  // does not work properly because there is nothing to base the percentage on.
  // We cannot use vh units because mobile browsers adjust the window height dynamically
  // when the address bar/bottom toolbars show and hide on scroll and vh units are fixed.
  // Also, the visual viewport is smaller than the layout viewport when the virtual keyboard
  // is up, so use the VisualViewport API to ensure the tray is displayed above the keyboard.
  const viewport = useViewportSize()
  const [height, setHeight] = useState(viewport.height)
  const timeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
    }

    // When the height is decreasing, and the keyboard is visible
    // (visual viewport smaller than layout viewport), delay setting
    // the new max height until after the animation is complete
    // so that there isn't an empty space under the tray briefly.
    if (viewport.height < height && viewport.height < window.innerHeight) {
      timeoutRef.current = setTimeout(() => {
        setHeight(viewport.height)
      }, 500)
    } else {
      setHeight(viewport.height)
    }
  }, [height, viewport.height])

  return (
    <div className={css['tray']} data-open={isOpen}>
      <div
        ref={ref}
        {...mergeProps(otherProps, overlayProps, modalProps)}
        className={css['tray-content']}
      >
        {children}
      </div>
    </div>
  )
})
