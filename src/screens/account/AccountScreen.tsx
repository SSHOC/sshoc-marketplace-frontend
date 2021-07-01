import Link from 'next/link'
import { Fragment } from 'react'

import { useGetLoggedInUser } from '@/api/sshoc'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as ActorsIcon } from '@/elements/icons/big/actors.svg'
import { Svg as ContributedItemsIcon } from '@/elements/icons/big/contributed-items.svg'
import { Svg as DraftItemsIcon } from '@/elements/icons/big/draft-items.svg'
import { Svg as ModerateItemsIcon } from '@/elements/icons/big/moderate-items.svg'
import { Svg as SourcesIcon } from '@/elements/icons/big/sources.svg'
import { Svg as UsersIcon } from '@/elements/icons/big/users.svg'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { Title } from '@/modules/ui/typography/Title'

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
    label: 'Users',
    pathname: '/account/users',
    icon: UsersIcon,
    roles: ['administrator'],
  },
]

/**
 * My account screen.
 */
export default function AccountScreen(): JSX.Element {
  const user = useGetLoggedInUser()

  // just for typescript - user should always exist here
  if (user.data == null) return <div>User not found</div>

  return (
    <Fragment>
      <Metadata noindex title="My account" />
      <GridLayout>
        <Header
          image={'/assets/images/search/clouds@2x.png'}
          showSearchBar={false}
        >
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              { pathname: '/account', label: 'My account' },
            ]}
          />
        </Header>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>My account</Title>
          <ul className="grid grid-cols-3 gap-10">
            {fields.map((route, index) => {
              if (
                Array.isArray(route.roles) &&
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                !route.roles.includes(user.data.role!)
              ) {
                return null
              }

              return (
                <li key={index}>
                  <Link href={{ pathname: route.pathname }}>
                    <a className="flex flex-col items-center p-6 space-y-2 border rounded bg-highlight-50 border-highlight-75">
                      <Icon
                        icon={route.icon}
                        className="w-12 h-12 my-2 text-highlight-300"
                      />
                      <h2 className="text-lg text-primary-700">
                        {route.label}
                      </h2>
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
