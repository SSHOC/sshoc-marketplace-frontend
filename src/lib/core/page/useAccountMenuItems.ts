import { useAuth } from '@/lib/core/auth/useAuth'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { routes } from '@/lib/core/navigation/routes'
import type { Href } from '@/lib/core/navigation/types'

interface MenuItemBase {
  id: string
  label: string
  type: 'button' | 'link' | 'nav-link'
}

interface MenuItemNavLink extends MenuItemBase {
  type: 'nav-link'
  href: Href
}

interface MenuItemLink extends MenuItemBase {
  type: 'link'
  href: string
}

interface MenuItemButton extends MenuItemBase {
  type: 'button'
  onPress: () => void
}

type MenuItem = MenuItemButton | MenuItemLink | MenuItemNavLink

export function useAccountMenuItems(): Array<MenuItem> {
  const { t } = useI18n<'common'>()
  const { signOut } = useAuth()

  const items: Array<MenuItem> = [
    {
      id: 'account',
      label: t(['common', 'pages', 'account']),
      type: 'nav-link',
      href: routes.AccountPage(),
    },
    {
      id: 'sign-out',
      label: t(['common', 'auth', 'sign-out']),
      type: 'button',
      onPress() {
        signOut()
      },
    },
  ]

  return items
}
