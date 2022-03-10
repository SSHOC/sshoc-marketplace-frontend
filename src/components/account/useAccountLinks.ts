import type { ReactNode, SVGProps, VFC } from 'react'

import type { UserRole } from '@/data/sshoc/api/user'
import { useCurrentUser } from '@/data/sshoc/hooks/auth'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { routes } from '@/lib/core/navigation/routes'
import type { Href } from '@/lib/core/navigation/types'
import ActorsIcon from '~/public/assets/images/account/actors.svg?symbol-icon'
import ContributedItemsIcon from '~/public/assets/images/account/contributed-items.svg?symbol-icon'
import DraftItemsIcon from '~/public/assets/images/account/draft-items.svg?symbol-icon'
import ModerateItemsIcon from '~/public/assets/images/account/moderate-items.svg?symbol-icon'
import SourcesIcon from '~/public/assets/images/account/sources.svg?symbol-icon'
import UsersIcon from '~/public/assets/images/account/users.svg?symbol-icon'
import VocabulariesIcon from '~/public/assets/images/account/vocabularies.svg?symbol-icon'

export interface AccountLink {
  href: Href
  label: string
  icon: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>
  roles: Array<UserRole>
}

export type AccountLinks = Array<AccountLink>

export function useAccountLinks(): AccountLinks {
  const { t } = useI18n<'authenticated' | 'common'>()
  const currentUser = useCurrentUser()

  if (currentUser.data == null) return []

  const links: AccountLinks = [
    {
      href: routes.ContributedItemsPage(),
      label: t(['authenticated', 'pages', 'contributed-items']),
      icon: ContributedItemsIcon,
      roles: ['administrator', 'moderator', 'contributor'],
    },
    {
      href: routes.DraftItemsPage(),
      label: t(['authenticated', 'pages', 'draft-items']),
      icon: DraftItemsIcon,
      roles: ['administrator', 'moderator', 'contributor'],
    },
    {
      href: routes.ModerateItemsPage({ 'd.status': '(suggested OR ingested)' }),
      label: t(['authenticated', 'pages', 'moderate-items']),
      icon: ModerateItemsIcon,
      roles: ['administrator', 'moderator'],
    },
    {
      href: routes.ActorsPage(),
      label: t(['authenticated', 'pages', 'actors']),
      icon: ActorsIcon,
      roles: ['administrator', 'moderator'],
    },
    {
      href: routes.SourcesPage(),
      label: t(['authenticated', 'pages', 'sources']),
      icon: SourcesIcon,
      roles: ['administrator'],
    },
    {
      href: routes.UsersPage(),
      label: t(['authenticated', 'pages', 'users']),
      icon: UsersIcon,
      roles: ['administrator'],
    },
    {
      href: routes.VocabulariesPage(),
      label: t(['authenticated', 'pages', 'vocabularies']),
      icon: VocabulariesIcon,
      roles: ['administrator', 'moderator'],
    },
  ]

  const allowed = links.filter((link) => {
    return link.roles.includes(currentUser.data.role)
  })

  return allowed
}
