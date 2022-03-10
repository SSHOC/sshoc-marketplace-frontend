import type { OverlayProps } from '@react-aria/overlays'
import { useOverlay } from '@react-aria/overlays'
import { useObjectRef } from '@react-aria/utils'
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'

import css from '@/lib/core/page/Popover.module.css'

export interface PopoverProps extends OverlayProps {
  children?: ReactNode
}

/**
 * FIXME: Merge with `@lib/core/ui/Popover.tsx`.
 */
export const Popover = forwardRef(function Popover(
  props: PopoverProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const overlayRef = useObjectRef(forwardedRef)
  const { overlayProps } = useOverlay(props, overlayRef)

  return (
    <div {...overlayProps} className={css['container']} ref={overlayRef}>
      {props.children}
    </div>
  )
})
