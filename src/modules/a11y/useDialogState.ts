import { useState } from 'react'

export function useDialogState(): {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
} {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    open() {
      setIsOpen(true)
    },
    close() {
      setIsOpen(false)
    },
    toggle() {
      setIsOpen((isOpen) => !isOpen)
    },
  }
}
