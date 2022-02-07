import cx from 'clsx'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Fragment } from 'react'

import type { UserDto } from '@/api/sshoc'
import { useCurrentUser } from '@/api/sshoc/client'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as ActorsIcon } from '@/elements/icons/big/actors.svg'
import { Svg as ContributedItemsIcon } from '@/elements/icons/big/contributed-items.svg'
import { Svg as DraftItemsIcon } from '@/elements/icons/big/draft-items.svg'
import { Svg as ModerateItemsIcon } from '@/elements/icons/big/moderate-items.svg'
import { Svg as SourcesIcon } from '@/elements/icons/big/sources.svg'
import { Svg as UsersIcon } from '@/elements/icons/big/users.svg'
import { Svg as VocabulariesIcon } from '@/elements/icons/big/vocabularies.svg'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { Title } from '@/modules/ui/typography/Title'
import styles from '@/screens/account/AccountScreen.module.css'

const fields = [
  {
    label: 'My contributed items',
    pathname: '/account/contributed',
    icon: ContributedItemsIcon,
  },
  {
    label: 'My draft items',
    pathname: '/account/drafts',
    icon: DraftItemsIcon,
  },
  {
    label: 'Items to moderate',
    pathname: '/account/moderate',
    query: {
      'd.status': '(suggested OR ingested)',
    },
    icon: ModerateItemsIcon,
    roles: ['administrator', 'moderator'],
  },
  {
    label: 'Sources',
    pathname: '/account/sources',
    icon: SourcesIcon,
    roles: ['administrator'],
  },
  {
    label: 'Actors',
    pathname: '/account/actors',
    icon: ActorsIcon,
    roles: ['administrator', 'moderator'],
  },
  {
    label: 'Vocabularies',
    pathname: '/account/vocabularies',
    icon: VocabulariesIcon,
    roles: ['administrator', 'moderator'],
  },
  {
    label: 'Users',
    pathname: '/account/users',
    icon: UsersIcon,
    roles: ['administrator'],
  },
]
type UserRole = Exclude<UserDto['role'], undefined>
type NonSystemUserRole = Exclude<UserRole, 'system-contributor' | 'system-moderator'>

const welcomeMessage: Record<NonSystemUserRole, ReactNode> = {
  contributor: (
    <Fragment>
      Dear contributor to the SSH Open Marketplace, welcome to the curation dashboard of the SSH
      Open Marketplace! You can find here the list of items you have contributed to as well as the
      list of your draft items. Now that you are logged in, you can create and edit items. Please
      consult the{' '}
      <Link href="/contribute">
        <a className="transition-colors text-primary-500 hover:text-primary-750">
          contributor guidelines
        </a>
      </Link>{' '}
      if you need to be guided in the process.
    </Fragment>
  ),
  moderator: (
    <Fragment>
      Dear moderator of the SSH Open Marketplace, welcome to the curation dashboard! As any
      contributor, you can find here the list of items you have contributed to as well as the list
      of your draft items. Because of your moderator status, you can also access the list of items
      to moderate and manage the actors referenced in the Marketplace. Please consult the{' '}
      <Link href="/contribute">
        <a className="transition-colors text-primary-500 hover:text-primary-750">
          contribute pages
        </a>
      </Link>{' '}
      if you need some guidance.
    </Fragment>
  ),
  administrator: (
    <Fragment>
      Dear administrator of the SSH Open Marketplace, welcome to the curation dashboard! As any
      contributor, you can find here the list of items you have contributed to as well as the list
      of your draft items. As any moderator, you can also access the list of items to moderate and
      manage the actors referenced in the Marketplace. And because of your administrator status, you
      can also manage sources and users. Please consult the{' '}
      <Link href="/contribute">
        <a className="transition-colors text-primary-500 hover:text-primary-750">
          contribute pages
        </a>
      </Link>{' '}
      if you need some guidance.
    </Fragment>
  ),
}

/**
 * My account screen.
 */
export default function AccountScreen(): JSX.Element {
  const user = useCurrentUser()

  // just for typescript - user should always exist here
  if (user.data == null) return <div>User not found</div>

  return (
    <Fragment>
      <Metadata noindex title="My account" />
      <GridLayout>
        <Header image={'/assets/images/search/clouds@2x.png'} showSearchBar={false}>
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              { pathname: '/account', label: 'My account' },
            ]}
          />
        </Header>
        <ContentColumn className={cx('px-6 py-12 space-y-12', styles.content)}>
          <Title>My account</Title>
          <p className="py-6 leading-relaxed text-gray-550">
            {welcomeMessage[user.data.role as NonSystemUserRole]}
          </p>
          <ul className={styles.grid}>
            {fields.map((route, index) => {
              if (Array.isArray(route.roles) && !route.roles.includes(user.data.role!)) {
                return null
              }

              return (
                <li key={index}>
                  <Link href={{ pathname: route.pathname, query: route.query }}>
                    <a className="flex flex-col items-center p-6 space-y-2 border rounded bg-highlight-50 border-highlight-75">
                      <Icon icon={route.icon} className="w-12 h-12 my-2 text-highlight-300" />
                      <h2 className="text-lg text-primary-700">{route.label}</h2>
                    </a>
                  </Link>
                </li>
              )
            })}
          </ul>
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
