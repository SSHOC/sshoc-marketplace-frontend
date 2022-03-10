import { useButton } from '@react-aria/button'
import { FocusScope } from '@react-aria/focus'
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
import { Fragment, useRef } from 'react'

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
  const router = useRouter()

  const state = useMenuTriggerState({})
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { menuProps, menuTriggerProps } = useMenuTrigger({ type: 'menu' }, state, buttonRef)
  const { buttonProps } = useButton(menuTriggerProps, buttonRef)

  const items = useAccountMenuItems()

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
        {...buttonProps}
        data-state={state.isOpen ? 'expanded' : 'collapsed'}
        className={css['menu-button']}
        ref={buttonRef}
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
              menuProps={menuProps}
              aria-label={t(['common', 'auth', 'account-menu'])}
              autoFocus={state.focusStrategy}
              onClose={state.close}
              onAction={onAction}
              items={items}
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
  const isFocused = state.selectionManager.focusedKey === item.key
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
        {...menuItemProps}
        className={menuStyles['nav-menu-item']}
        ref={ref as RefObject<HTMLLIElement>}
      >
        <Button variant="nav-menu-link">{item.rendered}</Button>
      </li>
    )
  }

  if (item.props.type === 'link') {
    return (
      <li role="none" className={menuStyles['nav-menu-item']}>
        <a
          {...menuItemProps}
          className={menuStyles['nav-menu-link']}
          href={item.props.href}
          target="_blank"
          rel="noreferrer"
          ref={ref as RefObject<HTMLAnchorElement>}
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
