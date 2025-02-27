import { useButton } from '@react-aria/button'
import { FocusScope, useFocusRing } from '@react-aria/focus'
import { useHover } from '@react-aria/interactions'
import { useMenu, useMenuItem, useMenuTrigger } from '@react-aria/menu'
import { DismissButton } from '@react-aria/overlays'
import { mergeProps } from '@react-aria/utils'
import { Item } from '@react-stately/collections'
import { useMenuTriggerState } from '@react-stately/menu'
import type { TreeState } from '@react-stately/tree'
import { useTreeState } from '@react-stately/tree'
import type { AriaMenuProps } from '@react-types/menu'
import type { Node } from '@react-types/shared'
import { useRouter } from 'next/router'
import type { HTMLAttributes, Key, RefObject } from 'react'
import { Fragment, useEffect, useRef } from 'react'

import { NavLink } from '@/components/common/NavLink'
import { useCurrentUser } from '@/data/sshoc/hooks/auth'
import { useAuth } from '@/lib/core/auth/useAuth'
import { useI18n } from '@/lib/core/i18n/useI18n'
import css from '@/lib/core/page/AccountMenu.module.css'
import menuStyles from '@/lib/core/page/NavigationMenu.module.css'
import { Popover } from '@/lib/core/page/Popover'
import { useAccountMenuItems } from '@/lib/core/page/useAccountMenuItems'
import { Button } from '@/lib/core/ui/Button/Button'

export function AccountMenu(): JSX.Element {
  const { t } = useI18n<'common'>()
  const { isSignedIn } = useAuth()
  const currentUser = useCurrentUser()

  const state = useMenuTriggerState({})
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { menuProps, menuTriggerProps } = useMenuTrigger({ type: 'menu' }, state, buttonRef)
  const { buttonProps } = useButton(menuTriggerProps, buttonRef)

  const { hoverProps, isHovered } = useHover({})
  const { focusProps, isFocusVisible } = useFocusRing()

  const items = useAccountMenuItems()

  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', state.close)

    return () => {
      router.events.off('routeChangeStart', state.close)
    }
  }, [router, state.close])

  function onAction(key: Key) {
    const item = items.find((item) => {
      return item.id === key
    })

    if (item == null) return

    if (item.type === 'button') {
      item.onPress()
    } else {
      router.push(item.href)
    }
  }

  if (!isSignedIn || currentUser.data == null) {
    return <Fragment />
  }

  return (
    <div className={css['container']}>
      <button
        ref={buttonRef}
        {...mergeProps(focusProps, hoverProps, buttonProps)}
        className={css['menu-button']}
        data-focused={isFocusVisible ? '' : undefined}
        data-hovered={isHovered ? '' : undefined}
        data-state={state.isOpen ? 'expanded' : 'collapsed'}
      >
        {t(['common', 'auth', 'account-menu-message'], {
          values: { username: currentUser.data.displayName },
        })}
      </button>
      {state.isOpen ? (
        <FocusScope restoreFocus>
          <Popover isDismissable isOpen={state.isOpen} onClose={state.close} shouldCloseOnBlur>
            <DismissButton onDismiss={state.close} />
            <Menu
              aria-label={t(['common', 'auth', 'account-menu'])}
              autoFocus={state.focusStrategy}
              items={items}
              menuProps={menuProps}
              onAction={onAction}
              onClose={state.close}
            >
              {(item) => {
                const props = { type: item.type, href: item.href }

                return <Item {...props}>{item.label}</Item>
              }}
            </Menu>
            <DismissButton onDismiss={state.close} />
          </Popover>
        </FocusScope>
      ) : null}
    </div>
  )
}

interface MenuProps<T> extends AriaMenuProps<T> {
  menuProps: HTMLAttributes<HTMLElement>
  onClose?: () => void
}

function Menu<T extends object>(props: MenuProps<T>) {
  const state = useTreeState<T>({ ...props, selectionMode: 'none' })

  const ref = useRef<HTMLUListElement>(null)
  const { menuProps } = useMenu(props, state, ref)

  return (
    <ul {...mergeProps(menuProps, props.menuProps)} className={menuStyles['nav-menu']} ref={ref}>
      {[...state.collection].map((item) => {
        return (
          <MenuItem
            key={item.key}
            item={item}
            state={state}
            onAction={props.onAction}
            onClose={props.onClose}
          />
        )
      })}
    </ul>
  )
}

interface MenuItemProps<T> {
  item: Node<T>
  state: TreeState<T>
  onAction?: (key: Key) => void
  onClose?: () => void
}

function MenuItem<T extends object>(props: MenuItemProps<T>) {
  const { item, state, onAction, onClose } = props

  const ref = useRef<HTMLAnchorElement | HTMLLIElement>(null)
  const isDisabled = state.disabledKeys.has(item.key)
  // const isFocused = state.selectionManager.focusedKey === item.key
  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      isDisabled,
      onAction,
      onClose,
    },
    state,
    ref,
  )

  if (item.props.type === 'button') {
    return (
      <li
        ref={ref as RefObject<HTMLLIElement>}
        {...menuItemProps}
        className={menuStyles['nav-menu-item']}
      >
        <Button variant="nav-menu-link">{item.rendered}</Button>
      </li>
    )
  }

  if (item.props.type === 'link') {
    return (
      <li role="none" className={menuStyles['nav-menu-item']}>
        <a
          ref={ref as RefObject<HTMLAnchorElement>}
          {...menuItemProps}
          className={menuStyles['nav-menu-link']}
          href={item.props.href}
          target="_blank"
          rel="noreferrer"
        >
          {item.rendered}
        </a>
      </li>
    )
  }

  return (
    <li role="none" className={menuStyles['nav-menu-item']}>
      <NavLink
        ref={ref as RefObject<HTMLAnchorElement>}
        {...menuItemProps}
        href={item.props.href}
        variant="nav-menu-link"
      >
        {item.rendered}
      </NavLink>
    </li>
  )
}
