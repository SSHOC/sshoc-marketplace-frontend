import { FocusScope } from '@react-aria/focus'
import { DismissButton, useOverlay } from '@react-aria/overlays'
import type { OverlayProps } from '@react-types/overlays'
import cx from 'clsx'
import type { ReactNode, RefObject } from 'react'
import { useRef } from 'react'

export interface PopoverProps extends OverlayProps {
  children: ReactNode
  popoverRef?: RefObject<HTMLDivElement>
  isOpen: boolean
  onClose: () => void
  isDismissable?: boolean
  shouldCloseOnBlur?: boolean
  /** @default "default" */
  variant?: 'combobox' | 'default' | 'listbox'
}

/**
 * Popover overlay.
 *
 * @private
 */
export function Popover(props: PopoverProps): JSX.Element | null {
  const { onClose, isOpen, shouldCloseOnBlur = true, isDismissable = true } = props

  const externalRef = props.popoverRef
  const internalRef = useRef<HTMLDivElement>(null)
  const ref = externalRef ?? internalRef
  const { overlayProps } = useOverlay(
    {
      shouldCloseOnBlur,
      isDismissable,
      onClose,
      isOpen,
    },
    ref,
  )

  const variant = props.variant ?? 'default'

  const styles = {
    overlay: cx(
      'absolute z-20 top-full min-w-full',
      variant === 'listbox' ? 'mt-1' : variant === 'combobox' ? 'mt-1' : 'right-0',
    ),
  }

  if (!isOpen) return null

  /**
   * ComboBox does not have a `FocusScope`, since focus always stays in the input,
   * and listbox items receive virtual focus via `aria-activedescendant`.
   */
  if (variant === 'combobox') {
    return (
      <div {...overlayProps} ref={ref} className={styles.overlay}>
        {props.children}
        <DismissButton onDismiss={props.onClose} />
      </div>
    )
  }

  return (
    <FocusScope restoreFocus>
      <div {...overlayProps} ref={ref} className={styles.overlay}>
        <DismissButton onDismiss={props.onClose} />
        {props.children}
        <DismissButton onDismiss={props.onClose} />
      </div>
    </FocusScope>
  )
}
