import type { Href } from '@/lib/core/navigation/types'

export interface NavItem {
  id: string
  label: string
  href: Href
}

export type NavItems = Array<NavItem>
