import type { FocusStrategy } from '@react-types/shared'
import type { HTMLAttributes, RefObject } from 'react'
import { createContext } from 'react'

export interface MenuContextValue extends HTMLAttributes<HTMLElement> {
  onClose?: () => void
  closeOnSelect?: boolean
  shouldFocusWrap?: boolean
  autoFocus?: FocusStrategy | boolean
  ref: RefObject<HTMLUListElement>
}

export const MenuContext = createContext<MenuContextValue | null>(null)
