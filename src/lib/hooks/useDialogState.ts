import { useState } from 'react'

/**
 * Manages dialog state.
 */
export function useDialogState(
  initialState = false,
): {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
} {
  const [isOpen, setIsOpen] = useState(initialState)
  function open() {
    setIsOpen(true)
  }
  function close() {
    setIsOpen(false)
  }
  function toggle() {
    setIsOpen((isOpen) => !isOpen)
  }
  return { isOpen, open, close, toggle }
}
