import { Dialog, Menu, Transition } from '@headlessui/react'
import { useButton } from '@react-aria/button'
import cx from 'clsx'
import Link from 'next/link'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import type { PropsWithChildren, ReactNode } from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'

import { useGetItemCategories } from '@/api/sshoc'
import { useCurrentUser } from '@/api/sshoc/client'
import type { ItemCategory, ItemSearchQuery } from '@/api/sshoc/types'
import { Button } from '@/elements/Button/Button'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { Svg as MenuIcon } from '@/elements/icons/small/menu.svg'
import { Svg as TriangleIcon } from '@/elements/icons/small/triangle.svg'
import { useDialogState } from '@/lib/hooks/useDialogState'
import { useDisclosure } from '@/modules/a11y/useDisclosure'
import { useDisclosureState } from '@/modules/a11y/useDisclosureState'
import { useAuth } from '@/modules/auth/AuthContext'
import ProtectedView from '@/modules/auth/ProtectedView'
import FullWidth from '@/modules/layout/FullWidth'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import styles from '@/modules/page/PageHeader.module.css'
import aboutLinks from '@/utils/aboutPages.preval'
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
          <a className="mx-4 my-6 md:mx-8">
            <Logo aria-label="Home" height="4em" className={styles.logo} />
          </a>
        </Link>
        <VStack className="items-end hidden space-y-2 2xl:flex">
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
                            {contributeLinks.map(({ menu, pathname }) => {
                              return (
                                <Menu.Item key={pathname}>
                                  {({ active }) => (
                                    <MenuLink
                                      href={{ pathname }}
                                      highlighted={active}
                                    >
                                      {menu}
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
                        {aboutLinks.map(({ menu, pathname }) => {
                          return (
                            <Menu.Item key={pathname}>
                              {({ active }) => (
                                <MenuLink
                                  href={{ pathname }}
                                  highlighted={active}
                                >
                                  {menu}
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
          </HStack>
        </VStack>
        <MobileNavigation />
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
      <a className="mx-6 my-2.5 text-gray-550 text-sm">Report an issue</a>
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

  if (auth.session !== null) {
    return (
      <div className="relative z-20 flex items-center space-x-6 text-gray-500">
        <ReportAnIssueButton path={router.asPath} user={user} />
        <div>
          <Menu>
            {({ open }) => (
              <Fragment>
                <Menu.Button
                  className={cx(
                    'bg-primary-800 text-white rounded-b transition-colors duration-150 py-2.5 px-12 text-sm inline-block hover:bg-primary-700',
                    'truncate max-w-xs',
                  )}
                >
                  Hi, {user?.displayName ?? auth.session?.user.username}
                </Menu.Button>
                <FadeIn show={open}>
                  <MenuPopover static className="text-primary-500">
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
                </FadeIn>
              </Fragment>
            )}
          </Menu>
        </div>
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
  variant,
}: PropsWithChildren<{
  href: UrlObject
  isMatching?: (href: UrlObject, router: NextRouter) => boolean
  variant?: 'secondary'
}>) {
  const isActive = useActiveLink(href, isMatching)
  const classNames = cx(
    'px-8 py-6 hover:bg-gray-50 transition-colors duration-150 text-center inline-flex items-center',
    isActive ? 'text-gray-800' : 'text-primary-500',
    variant === 'secondary' ? 'bg-white' : '',
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
}: PropsWithChildren<{
  show: boolean
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
}: PropsWithChildren<{
  static: boolean
  className?: string
}>) {
  return (
    <Menu.Items
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
            className="justify-end hidden px-6 py-4 space-x-12 text-sm bg-highlight-50 text-secondary-750 2xl:flex"
          >
            {Object.keys(itemCategories).map((category) => {
              if (category === 'step') return null

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

/**
 * Mobile navigation.
 */
function MobileNavigation(): JSX.Element {
  const router = useRouter()
  const dialog = useDialogState()
  const auth = useAuth()
  const { data: itemCategories = {} } = useGetItemCategories()
  const { data: user } = useCurrentUser()

  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ onPress: dialog.close }, closeButtonRef)

  useEffect(() => {
    router.events.on('routeChangeStart', dialog.close)

    return () => {
      router.events.off('routeChangeStart', dialog.close)
    }
  }, [router.events, dialog.close])

  return (
    <div className="m-4 md:m-8 2xl:hidden">
      <Button
        style={{
          width: 40,
          height: 40,
          display: 'grid',
          placeItems: 'center',
          padding: 0,
        }}
        variant="gradient"
        onPress={dialog.open}
      >
        <MenuIcon
          aria-label="Open navigation menu"
          width="1em"
          className="w-6 h-6"
        />
      </Button>
      <Transition
        show={dialog.isOpen}
        enter="transition duration-100 ease-out"
        enterFrom="transform translate-x-12 opacity-0"
        enterTo="transform translate-x-0 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform translate-x-0 opacity-100"
        leaveTo="transform translate-x-12 opacity-0"
      >
        <Dialog
          // open={dialog.isOpen}
          static
          onClose={dialog.close}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex justify-end min-h-screen ">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="relative w-full max-w-xl bg-gray-100">
              <header className="flex items-center justify-between px-4 py-6 space-x-2 border-b border-gray-250 bg-[#ECEEEF]">
                <Dialog.Title className="sr-only">
                  Main navigation menu
                </Dialog.Title>
                <Link href="/">
                  <a>
                    <Logo
                      aria-label="Home"
                      height="4em"
                      className={styles.logo}
                    />
                  </a>
                </Link>
                <button
                  {...buttonProps}
                  ref={closeButtonRef}
                  className="transition text-primary-750 hover:text-secondary-600"
                >
                  <CloseIcon
                    aria-label="Close navigation menu"
                    width="1em"
                    className="w-5 h-5 m-5"
                  />
                </button>
              </header>

              <HStack as="ul" className="flex flex-col ">
                <li className="grid">
                  {user == null ? (
                    <NavLink href={{ pathname: '/auth/sign-in' }}>
                      Sign in
                    </NavLink>
                  ) : (
                    <NavDisclosure label={`Hi, ${user.displayName}`}>
                      <ul>
                        <li className="grid">
                          <NavLink
                            variant="secondary"
                            href={{ pathname: '/account' }}
                          >
                            My account
                          </NavLink>
                        </li>
                        <li className="grid">
                          <button
                            className="inline-flex items-center px-8 py-6 text-center transition-colors duration-150 bg-white hover:bg-gray-50 text-primary-500"
                            onClick={() => {
                              dialog.close()
                              auth.signOut()
                            }}
                          >
                            Sign out
                          </button>
                        </li>
                      </ul>
                    </NavDisclosure>
                  )}
                </li>
                <li
                  role="separator"
                  className="w-full border-b border-gray-250"
                />
                {Object.entries(itemCategories).map(([category, label]) => {
                  if (category === 'step') return null

                  const query: ItemSearchQuery = {
                    categories: [category as ItemCategory],
                    order: ['label'],
                  }

                  return (
                    <li key={category} className="grid">
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
                <li
                  role="separator"
                  className="w-full border-b border-gray-250"
                />
                <li className="grid">
                  <NavDisclosure label="Browse">
                    <ul>
                      <li className="grid">
                        <NavLink
                          variant="secondary"
                          href={{ pathname: '/browse/activity' }}
                        >
                          Browse activities
                        </NavLink>
                      </li>
                      <li className="grid">
                        <NavLink
                          variant="secondary"
                          href={{ pathname: '/browse/keyword' }}
                        >
                          Browse keywords
                        </NavLink>
                      </li>
                    </ul>
                  </NavDisclosure>
                </li>
                <li
                  role="separator"
                  className="w-full border-b border-gray-250"
                />
                <li className="grid">
                  <NavDisclosure label="Contribute">
                    <ul>
                      {contributeLinks.map(({ menu, pathname }) => {
                        return (
                          <li key={pathname} className="grid">
                            <NavLink variant="secondary" href={{ pathname }}>
                              {menu}
                            </NavLink>
                          </li>
                        )
                      })}
                    </ul>
                  </NavDisclosure>
                </li>
                <li className="grid">
                  <NavDisclosure label="About">
                    <ul>
                      {aboutLinks.map(({ menu, pathname }) => {
                        return (
                          <li key={pathname} className="grid">
                            <NavLink variant="secondary" href={{ pathname }}>
                              {menu}
                            </NavLink>
                          </li>
                        )
                      })}
                    </ul>
                  </NavDisclosure>
                </li>
                <li
                  role="separator"
                  className="w-full border-b border-gray-250"
                />
                {auth.session?.accessToken != null
                  ? Object.entries(itemCategories).map(([category, label]) => {
                      if (category === 'step') return null

                      return (
                        <li key={category} className="grid">
                          <NavLink href={{ pathname: `/${category}/create` }}>
                            Create{' '}
                            {getSingularItemCategoryLabel(
                              category as ItemCategory,
                            )}
                          </NavLink>
                        </li>
                      )
                    })
                  : null}
              </HStack>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

function NavDisclosure({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const state = useDisclosureState({})
  const { panelProps, triggerProps } = useDisclosure(state)

  return (
    <Fragment>
      <button
        className={cx(
          'flex items-center justify-between px-8 py-6 text-center transition-colors duration-150',
          state.isOpen
            ? 'bg-secondary-600 text-white hover:bg-secondary-600'
            : 'text-primary-500 hover:bg-gray-50',
        )}
        onClick={state.toggle}
        {...triggerProps}
      >
        <span>{label}</span>
        <Icon
          icon={TriangleIcon}
          aria-hidden
          className={cx('w-2.5 h-2.5', state.isOpen && 'transform rotate-180')}
        />
      </button>
      {state.isOpen ? <div {...panelProps}>{children}</div> : null}
    </Fragment>
  )
}
