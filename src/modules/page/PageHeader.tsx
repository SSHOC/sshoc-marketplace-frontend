import { Menu, Transition } from '@headlessui/react'
import cx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { NextRouter } from 'next/router'
import type { PropsWithChildren } from 'react'
import { Fragment, useEffect, useState } from 'react'
import FullWidth from '../layout/FullWidth'
import { useGetItemCategories, useGetLoggedInUser } from '@/api/sshoc'
import type { ItemCategory, ItemSearchQuery } from '@/api/sshoc/types'
import { useAuth } from '@/modules/auth/AuthContext'
import ProtectedView from '@/modules/auth/ProtectedView'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import styles from '@/modules/page/PageHeader.module.css'
import { createUrlFromPath } from '@/utils/createUrlFromPath'
import { getRedirectPath } from '@/utils/getRedirectPath'
import { getSingularItemCategoryLabel } from '@/utils/getSingularItemCategoryLabel'
import type { UrlObject } from '@/utils/useActiveLink'
import { useActiveLink } from '@/utils/useActiveLink'
import { Svg as Logo } from '@@/assets/images/logo-with-text.svg'

/**
 * Page header.
 */
export default function PageHeader(): JSX.Element {
  return (
    <GridLayout as="header">
      <MainNavigation />
    </GridLayout>
  )
}

/**
 * Main navigation.
 */
function MainNavigation(): JSX.Element {
  const { data: itemCategories = {} } = useGetItemCategories()

  return (
    <Fragment>
      <b className={cx(styles.leftBleed, 'border-b border-gray-200')} />
      <FullWidth
        as="nav"
        aria-label="Main menu"
        className="flex justify-between border-b border-gray-200 items-center"
      >
        <NavLink href={{ pathname: '/' }}>
          <Logo aria-label="Home" height="4em" />
        </NavLink>
        <VStack className="items-end space-y-2">
          <HStack as="ul">
            <li>
              <AuthButton />
            </li>
          </HStack>
          <HStack as="ul" className="items-center">
            {Object.entries(itemCategories).map(([category, label]) => {
              const query: ItemSearchQuery = {
                categories: [category as ItemCategory],
                order: ['label'],
              }
              return (
                <li key={category}>
                  <NavLink
                    href={{ pathname: '/search', query }}
                    isMatching={(href, router) => {
                      return (
                        router.pathname === '/search' &&
                        router.query.category === category
                      )
                    }}
                  >
                    {label}
                  </NavLink>
                </li>
              )
            })}
            <Separator />
            <li className="relative z-10">
              <Menu>
                {({ open }) => (
                  <Fragment>
                    <MenuButton isOpen={open}>Browse</MenuButton>
                    <FadeIn show={open}>
                      <MenuPopover static>
                        <Menu.Item>
                          {({ active }) => (
                            <MenuLink
                              href={{ pathname: '/browse/activity' }}
                              highlighted={active}
                            >
                              Browse activities
                            </MenuLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <MenuLink
                              href={{ pathname: '/browse/keyword' }}
                              highlighted={active}
                            >
                              Browse keywords
                            </MenuLink>
                          )}
                        </Menu.Item>
                      </MenuPopover>
                    </FadeIn>
                  </Fragment>
                )}
              </Menu>
            </li>
            <Separator />
            <li className="relative z-10">
              <Menu>
                {({ open }) => (
                  <Fragment>
                    <MenuButton isOpen={open}>About</MenuButton>
                    <FadeIn show={open}>
                      <MenuPopover static>
                        <Menu.Item>
                          {({ active }) => (
                            <MenuLink
                              href={{ pathname: '/about' }}
                              highlighted={active}
                            >
                              About the project
                            </MenuLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <MenuLink
                              href={{ pathname: '/about/website' }}
                              highlighted={active}
                            >
                              About the website
                            </MenuLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <MenuLink
                              href={{ pathname: '/about/team' }}
                              highlighted={active}
                            >
                              About the team
                            </MenuLink>
                          )}
                        </Menu.Item>
                      </MenuPopover>
                    </FadeIn>
                  </Fragment>
                )}
              </Menu>
            </li>
          </HStack>
        </VStack>
      </FullWidth>
      <b className={cx(styles.rightBleed, 'border-b border-gray-200')} />
      <ProtectedView>
        <CreateItemsMenu />
      </ProtectedView>
    </Fragment>
  )
}

function AuthButton() {
  const router = useRouter()
  const auth = useAuth()
  const { data: user } = useGetLoggedInUser(
    {
      enabled: auth.session?.accessToken !== undefined,
      /** immediately sign out in case of error */
      retry: false,
      onError() {
        auth.signOut()
      },
    },
    {
      token: auth.session?.accessToken,
    },
  )
  const [redirectPath, setRedirectPath] = useState(() => {
    const path = getRedirectPath(router.asPath)
    if (path === undefined) return undefined
    /** avoid hydration warning */
    return createUrlFromPath(path).pathname
  })

  /**
   * avoid hydration warning on pages like `/search?categories=dataset`,
   * because the query params are not yet available on statically prerendered pages.
   * this is also why we initialize `redirectPath` without query params.
   *
   * note: unfortunately this *will* still print a hydration warning on the 404 page.
   */
  useEffect(() => {
    setRedirectPath(getRedirectPath(router.asPath))
  }, [router.asPath])

  if (auth.session !== null) {
    return (
      <div className="flex items-center space-x-6 text-gray-500">
        <p>Signed in as {user?.displayName ?? auth.session.user.username}</p>
        <NavLinkButton href={{ pathname: '/auth/sign-out' }}>
          Sign out
        </NavLinkButton>
      </div>
    )
  }

  return (
    <NavLinkButton
      href={{
        pathname: '/auth/sign-in',
        query: redirectPath !== undefined ? { from: redirectPath } : {},
      }}
    >
      Sign in
    </NavLinkButton>
  )
}

function NavLinkButton({
  href,
  children,
}: PropsWithChildren<{ href: UrlObject }>) {
  const isActive = useActiveLink(href)
  const classNames = cx(
    'bg-primary-800 text-white rounded-b transition-colors duration-150 py-2 px-12 text-sm inline-block hover:bg-primary-700',
  )
  return (
    <Link href={href}>
      <a aria-current={isActive ? 'page' : undefined} className={classNames}>
        {children}
      </a>
    </Link>
  )
}

function NavLink({
  href,
  children,
  isMatching,
}: PropsWithChildren<{
  href: UrlObject
  isMatching?: (href: UrlObject, router: NextRouter) => boolean
}>) {
  const isActive = useActiveLink(href, isMatching)
  const classNames = cx(
    'px-8 py-6 inline-block hover:bg-gray-50 transition-colors duration-150',
    isActive ? 'text-gray-800' : 'text-primary-500',
  )
  return (
    <Link href={href}>
      <a aria-current={isActive ? 'page' : undefined} className={classNames}>
        {children}
      </a>
    </Link>
  )
}

function FadeIn({ show, children }: PropsWithChildren<{ show: boolean }>) {
  return (
    <Transition
      show={show}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      {children}
    </Transition>
  )
}

function MenuButton({
  isOpen,
  ...props
}: PropsWithChildren<{ isOpen: boolean }>) {
  return (
    <Menu.Button
      className={cx(
        'inline-block py-6 px-8 transition-colors duration-150',
        isOpen
          ? 'text-white bg-secondary-600 rounded-t'
          : 'text-primary-500 hover:bg-gray-50',
      )}
      {...props}
    />
  )
}

function MenuPopover({
  children,
  static: isStatic,
}: PropsWithChildren<{ static: boolean }>) {
  return (
    <Menu.Items
      static={isStatic}
      className="absolute right-0 flex flex-col w-64 mt-1 overflow-hidden origin-top-right bg-white border border-gray-200 rounded shadow-md z-10"
    >
      {children}
    </Menu.Items>
  )
}

function MenuLink({
  href,
  highlighted,
  children,
  ...props
}: PropsWithChildren<{
  href: UrlObject
  highlighted: boolean
}>) {
  const isActive = useActiveLink(href)
  const classNames = cx(
    'px-8 py-6 inline-block transition-colors duration-150',
    isActive ? 'text-gray-800' : 'text-primary-500',
    highlighted && 'bg-gray-50',
  )
  return (
    <Link href={href}>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={classNames}
        {...props}
      >
        {children}
      </a>
    </Link>
  )
}

function Separator() {
  return <li role="separator" className="w-px h-6 mx-4 bg-gray-200" />
}

function CreateItemsMenu() {
  const { data: itemCategories = {} } = useGetItemCategories()
  return (
    <Fragment>
      <b className="bg-highlight-50" />
      <FullWidth>
        <nav>
          <HStack
            as="ul"
            className="bg-highlight-50 text-sm text-secondary-750 px-6 py-4 justify-end space-x-12"
          >
            {Object.keys(itemCategories).map((category) => {
              return (
                <li key={category}>
                  <Link href={{ pathname: `/${category}/create` }}>
                    <a className="hover:text-secondary-500 transition-colors duration-150">
                      Create{' '}
                      {getSingularItemCategoryLabel(
                        category as Exclude<ItemCategory, 'step'>,
                      )}
                    </a>
                  </Link>
                </li>
              )
            })}
          </HStack>
        </nav>
      </FullWidth>
      <b className="bg-highlight-50" />
    </Fragment>
  )
}
