import { Menu, Transition } from '@headlessui/react'
import cx from 'clsx'
import Link from 'next/link'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import type { PropsWithChildren, Ref } from 'react'
import { Fragment, useEffect, useState } from 'react'

import { useGetItemCategories } from '@/api/sshoc'
import { useCurrentUser } from '@/api/sshoc/client'
import type { ItemCategory, ItemSearchQuery } from '@/api/sshoc/types'
import { useAuth } from '@/modules/auth/AuthContext'
import ProtectedView from '@/modules/auth/ProtectedView'
import FullWidth from '@/modules/layout/FullWidth'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import styles from '@/modules/page/PageHeader.module.css'
import contributeLinks from '@/utils/contributePages.preval'
import { createUrlFromPath } from '@/utils/createUrlFromPath'
import { getRedirectPath } from '@/utils/getRedirectPath'
import { getScalarQueryParameter } from '@/utils/getScalarQueryParameter'
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
        className="flex items-center justify-between border-b border-gray-200"
      >
        <Link href={{ pathname: '/' }}>
          <a className="mx-8">
            <Logo aria-label="Home" height="4.5em" />
          </a>
        </Link>
        <VStack className="items-end space-y-2">
          <HStack as="ul">
            <li>
              <AuthButton />
            </li>
          </HStack>
          <HStack as="ul" className="items-center">
            {Object.entries(itemCategories).map(([category, label]) => {
              if (category === 'step') return null

              const query: ItemSearchQuery = {
                categories: [category as ItemCategory],
                order: ['label'],
              }
              return (
                <li key={category} className="inline-flex">
                  <NavLink
                    href={{ pathname: '/search', query }}
                    isMatching={(href, router) => {
                      return (
                        router.pathname === '/search' &&
                        router.query.category === category
                      )
                    }}
                  >
                    {label as string}
                  </NavLink>
                </li>
              )
            })}
            <Separator />
            <li className="relative z-10 inline-flex">
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
            {contributeLinks.length > 0 ? (
              <Fragment>
                <Separator />
                <li className="relative z-10 inline-flex">
                  <Menu>
                    {({ open }) => (
                      <Fragment>
                        <MenuButton isOpen={open}>Contribute</MenuButton>
                        <FadeIn show={open}>
                          <MenuPopover static>
                            {contributeLinks.map(({ label, pathname }) => {
                              return (
                                <Menu.Item key={pathname}>
                                  {({ active }) => (
                                    <MenuLink
                                      href={{ pathname }}
                                      highlighted={active}
                                    >
                                      {label}
                                    </MenuLink>
                                  )}
                                </Menu.Item>
                              )
                            })}
                          </MenuPopover>
                        </FadeIn>
                      </Fragment>
                    )}
                  </Menu>
                </li>
              </Fragment>
            ) : null}
            <Separator />
            <li className="relative z-10 inline-flex">
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
                              href={{ pathname: '/about/service' }}
                              highlighted={active}
                            >
                              About the service
                            </MenuLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <MenuLink
                              href={{ pathname: '/about/implementation' }}
                              highlighted={active}
                            >
                              About the technical aspects
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

function ReportAnIssueButton({
  user,
  path,
}: {
  user?: { email?: string }
  path: string
}) {
  return (
    <Link
      href={{
        pathname: '/contact',
        query: {
          email: user?.email,
          subject: 'Report an issue',
          message: `I have found an issue on page ${new URL(
            path,
            process.env.NEXT_PUBLIC_SSHOC_BASE_URL,
          ).toString()}.\n\nPlease describe:\n\n`,
        },
      }}
    >
      <a className="mx-6 my-2.5 text-gray-550">Report an issue</a>
    </Link>
  )
}

function AuthButton() {
  const router = useRouter()
  const auth = useAuth()

  const { data: user } = useCurrentUser()
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

  function onSignOut() {
    auth.signOut()
    router.replace(
      getRedirectPath(getScalarQueryParameter(router.query.from)) ?? '/',
    )
  }

  /* Disable login on production deploy. */
  if (
    process.env.NEXT_PUBLIC_SSHOC_BASE_URL ===
    'https://marketplace.sshopencloud.eu'
  ) {
    return (
      <div className="relative flex items-center space-x-6 text-gray-500">
        <ReportAnIssueButton path={router.asPath} user={user} />
      </div>
    )
  }

  if (auth.session !== null) {
    return (
      <div className="relative flex items-center space-x-6 text-gray-500">
        <ReportAnIssueButton path={router.asPath} user={user} />
        <Menu>
          {({ open }) => (
            <Fragment>
              <Menu.Button
                className={cx(
                  'bg-primary-800 text-white rounded-b transition-colors duration-150 py-2.5 px-12 text-sm inline-block hover:bg-primary-700',
                  'truncate max-w-xs',
                  open ? '' : '',
                )}
              >
                Hi, {user?.displayName ?? auth.session?.user.username}
              </Menu.Button>
              <FadeIn show={open} as={Fragment}>
                {(ref: Ref<HTMLDivElement>) => (
                  <MenuPopover
                    static
                    className="top-full text-primary-500"
                    popoverRef={ref}
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <MenuAction
                          highlighted={active}
                          onClick={() => {
                            router.push({ pathname: '/account' })
                          }}
                        >
                          My account
                        </MenuAction>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <MenuAction highlighted={active} onClick={onSignOut}>
                          Sign out
                        </MenuAction>
                      )}
                    </Menu.Item>
                  </MenuPopover>
                )}
              </FadeIn>
            </Fragment>
          )}
        </Menu>
      </div>
    )
  }

  return (
    <div className="relative flex items-center space-x-6 text-gray-500">
      <ReportAnIssueButton path={router.asPath} />
      <NavLinkButton
        href={{
          pathname: '/auth/sign-in',
          query: redirectPath !== undefined ? { from: redirectPath } : {},
        }}
      >
        Sign in
      </NavLinkButton>
    </div>
  )
}

function NavLinkButton({
  href,
  children,
}: PropsWithChildren<{ href: UrlObject }>) {
  const isActive = useActiveLink(href)
  const classNames = cx(
    'bg-primary-800 text-white rounded-b transition-colors duration-150 py-2 px-12 text-sm inline-flex items-center hover:bg-primary-700',
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
    'px-8 py-6 hover:bg-gray-50 transition-colors duration-150 text-center inline-flex items-center',
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

function FadeIn({
  show,
  children,
  as,
}: PropsWithChildren<{
  show: boolean
  as?: React.ElementType
}>) {
  return (
    <Transition
      show={show}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      as={as}
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
        'inline py-6 px-8 transition-colors duration-150',
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
  className,
  popoverRef,
}: PropsWithChildren<{
  static: boolean
  className?: string
  popoverRef?: Ref<HTMLDivElement>
}>) {
  return (
    <Menu.Items
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={popoverRef}
      static={isStatic}
      className={cx(
        'absolute right-0 top-full z-20 flex flex-col w-64 mt-1 overflow-hidden origin-top-right bg-white border border-gray-200 rounded shadow-md',
        className,
      )}
    >
      {children}
    </Menu.Items>
  )
}

function MenuAction({
  highlighted,
  onClick,
  children,
}: PropsWithChildren<{
  highlighted: boolean
  onClick: () => void
}>) {
  const classNames = cx(
    'px-8 py-6 inline-block transition-colors duration-150 text-left hover:bg-gray-50',
    highlighted && 'bg-gray-50',
  )
  return (
    <button className={classNames} onClick={onClick}>
      {children}
    </button>
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
            className="justify-end px-6 py-4 space-x-12 text-sm bg-highlight-50 text-secondary-750"
          >
            {Object.keys(itemCategories).map((category) => {
              return (
                <li key={category}>
                  <Link href={{ pathname: `/${category}/create` }}>
                    <a className="transition-colors duration-150 hover:text-secondary-500">
                      Create{' '}
                      {getSingularItemCategoryLabel(category as ItemCategory)}
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
