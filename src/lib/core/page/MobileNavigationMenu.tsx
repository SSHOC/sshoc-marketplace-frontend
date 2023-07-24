import { OverlayContainer } from '@react-aria/overlays'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useRef } from 'react'

import { NavLink } from '@/components/common/NavLink'
import { useCurrentUser } from '@/data/sshoc/hooks/auth'
import { useAuth } from '@/lib/core/auth/useAuth'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { routes } from '@/lib/core/navigation/routes'
import type { Href } from '@/lib/core/navigation/types'
import { usePathname } from '@/lib/core/navigation/usePathname'
import { Disclosure } from '@/lib/core/page/Disclosure'
import css from '@/lib/core/page/MobileNavigationMenu.module.css'
import { ModalDialog } from '@/lib/core/page/ModalDialog'
import { useAboutNavItems } from '@/lib/core/page/useAboutNavItems'
import { useBrowseNavItems } from '@/lib/core/page/useBrowseNavItems'
import { useContributeNavItems } from '@/lib/core/page/useContributeNavItems'
import { useCreateItemLinks } from '@/lib/core/page/useCreateItemLinks'
import { useItemCategoryNavItems } from '@/lib/core/page/useItemCategoryNavItems'
import { Button } from '@/lib/core/ui/Button/Button'
import { CloseButton } from '@/lib/core/ui/CloseButton/CloseButton'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import MenuIcon from '@/lib/core/ui/icons/menu.svg?symbol-icon'
import { useModalDialogTriggerState } from '@/lib/core/ui/ModalDialog/useModalDialogState'
import { useModalDialogTrigger } from '@/lib/core/ui/ModalDialog/useModalDialogTrigger'
import Logo from '~/public/assets/images/logo-with-text.svg'

export function MobileNavigationMenu(): JSX.Element {
  return (
    <nav className={css['container']}>
      <NavigationMenu />
    </nav>
  )
}

function NavigationMenu(): JSX.Element {
  const { t } = useI18n<'common'>()
  const { isSignedIn } = useAuth()
  const state = useModalDialogTriggerState({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { triggerProps, overlayProps } = useModalDialogTrigger(
    { type: 'dialog' },
    state,
    triggerRef,
  )
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = useCurrentUser()

  useEffect(() => {
    router.events.on('routeChangeStart', state.close)
    window.addEventListener('resize', state.close, { passive: true })

    return () => {
      router.events.off('routeChangeStart', state.close)
      window.removeEventListener('resize', state.close)
    }
  }, [router.events, state.close])

  return (
    <Fragment>
      <Button
        ref={triggerRef}
        {...triggerProps}
        aria-label={t(['common', 'navigation-menu'])}
        color="gradient"
        onPress={state.toggle}
        style={{
          '--button-padding-inline': 'var(--space-2-5)',
          '--button-padding-block': 'var(--space-2-5)',
        }}
      >
        <Icon icon={MenuIcon} />
      </Button>
      {state.isOpen ? (
        <OverlayContainer>
          <ModalDialog
            {...(overlayProps as any)}
            aria-label={t(['common', 'navigation-menu'])}
            isOpen={state.isOpen}
            onClose={state.close}
            isDismissable
          >
            <header className={css['header']}>
              <div className={css['home-link']}>
                <NavLink aria-label={t(['common', 'pages', 'home'])} href={routes.HomePage()}>
                  <Image src={Logo} alt="" priority />
                </NavLink>
              </div>
              <CloseButton autoFocus onPress={state.close} size="lg" />
            </header>
            <div className={css['content']}>
              <nav className={css['main-nav']}>
                <ul className={css['nav-items']} role="list">
                  <AuthLinks onClose={state.close} />
                  <Separator />
                  <ItemCategoryNavLinks />
                  <Separator />
                  {isSignedIn ? (
                    <Fragment>
                      <CreateItemLinks />
                      <Separator />
                    </Fragment>
                  ) : null}
                  <BrowseNavLinks />
                  <Separator />
                  <ContributeNavLinks />
                  <AboutNavLinks />
                  <Separator />
                  <li className={css['nav-item']}>
                    <NavLink
                      variant="nav-mobile-menu-link"
                      href={routes.ContactPage({
                        email: currentUser.data?.email,
                        subject: t(['common', 'report-issue']),
                        message: t(['common', 'report-issue-message'], { values: { pathname } }),
                      })}
                    >
                      {t(['common', 'report-issue'])}
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </ModalDialog>
        </OverlayContainer>
      ) : null}
    </Fragment>
  )
}

interface AuthLinksProps {
  onClose: () => void
}

function AuthLinks(props: AuthLinksProps): JSX.Element {
  const { onClose } = props

  const { t } = useI18n<'common'>()
  const { isSignedIn, signOut } = useAuth()
  const currentUser = useCurrentUser()

  function onSignOut() {
    onClose()
    signOut()
  }

  if (!isSignedIn || currentUser.data == null) {
    const item = { href: routes.SignInPage(), label: t(['common', 'auth', 'sign-in']) }

    return (
      <li className={css['nav-item']}>
        <NavLink href={item.href} variant="nav-mobile-menu-link">
          {item.label}
        </NavLink>
      </li>
    )
  }

  const items = [
    { id: 'account', href: routes.AccountPage(), label: t(['common', 'pages', 'account']) },
  ] as Array<{ href: Href; label: string; id: string }>

  return (
    <li className={css['nav-item']}>
      <Disclosure
        label={t(['common', 'auth', 'account-menu-message'], {
          values: { username: currentUser.data.displayName },
        })}
        className={css['nav-link-disclosure-button']}
      >
        <ul role="list">
          {items.map((item) => {
            return (
              <li className={css['nav-item']} key={item.id}>
                <NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
                  {item.label}
                </NavLink>
              </li>
            )
          })}
          <li className={css['nav-item']}>
            <Button onPress={onSignOut} variant="nav-mobile-menu-link-secondary">
              {t(['common', 'auth', 'sign-out'])}
            </Button>
          </li>
        </ul>
      </Disclosure>
    </li>
  )
}

function ItemCategoryNavLinks(): JSX.Element {
  const items = useItemCategoryNavItems()

  if (items == null) {
    return <Fragment />
  }

  return (
    <Fragment>
      {items.map((item) => {
        return (
          <li className={css['nav-item']} key={item.id}>
            <NavLink href={item.href} variant="nav-mobile-menu-link">
              {item.label}
            </NavLink>
          </li>
        )
      })}
    </Fragment>
  )
}

function BrowseNavLinks(): JSX.Element {
  const { t } = useI18n<'common'>()
  const items = useBrowseNavItems()

  return (
    <li className={css['nav-item']}>
      <Disclosure
        label={t(['common', 'pages', 'browse'])}
        className={css['nav-link-disclosure-button']}
      >
        <ul role="list">
          {items.map((item) => {
            return (
              <li className={css['nav-item']} key={item.id}>
                <NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </Disclosure>
    </li>
  )
}

function ContributeNavLinks(): JSX.Element {
  const { t } = useI18n<'common'>()
  const items = useContributeNavItems()

  return (
    <li className={css['nav-item']}>
      <Disclosure
        label={t(['common', 'pages', 'contribute'])}
        className={css['nav-link-disclosure-button']}
      >
        <ul role="list">
          {items.map((item) => {
            return (
              <li className={css['nav-item']} key={item.id}>
                <NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </Disclosure>
    </li>
  )
}

function AboutNavLinks(): JSX.Element {
  const { t } = useI18n<'common'>()
  const items = useAboutNavItems()

  return (
    <li className={css['nav-item']}>
      <Disclosure
        label={t(['common', 'pages', 'about'])}
        className={css['nav-link-disclosure-button']}
      >
        <ul role="list">
          {items.map((item) => {
            return (
              <li className={css['nav-item']} key={item.id}>
                <NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </Disclosure>
    </li>
  )
}

function CreateItemLinks(): JSX.Element {
  const { t } = useI18n<'common'>()
  const items = useCreateItemLinks()

  if (items == null) {
    return <Fragment />
  }

  return (
    <li className={css['nav-item']}>
      <Disclosure
        label={t(['common', 'create-new-items'])}
        className={css['nav-link-disclosure-button']}
      >
        <ul role="list">
          {items.map((item) => {
            return (
              <li className={css['nav-item']} key={item.id}>
                <NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </Disclosure>
    </li>
  )
}

function Separator(): JSX.Element {
  return <li role="separator" className={css['nav-separator']} />
}
