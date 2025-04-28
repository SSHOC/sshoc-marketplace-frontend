import { useButton } from '@react-aria/button'
import { FocusScope } from '@react-aria/focus'
import { useMenu, useMenuItem, useMenuTrigger } from '@react-aria/menu'
import { DismissButton } from '@react-aria/overlays'
import { mergeProps } from '@react-aria/utils'
import { useMenuTriggerState } from '@react-stately/menu'
import type { TreeState } from '@react-stately/tree'
import { useTreeState } from '@react-stately/tree'
import type { AriaMenuProps, MenuTriggerProps } from '@react-types/menu'
import type { CollectionChildren, Node } from '@react-types/shared'
import { useRouter } from 'next/router'
import type { HTMLAttributes, ReactNode, RefObject } from 'react'
import { useEffect, useRef } from 'react'

import { NavLink } from '@/components/common/NavLink'
import css from '@/lib/core/page/NavigationMenu.module.css'
import pageNavigationStyles from '@/lib/core/page/PageNavigation.module.css'
import { Popover } from '@/lib/core/page/Popover'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import ChevronIcon from '@/lib/core/ui/icons/chevron.svg?symbol-icon'

export interface NavigationMenuProps<T extends object> extends MenuTriggerProps {
  label?: ReactNode
  menuLabel?: string
  children: CollectionChildren<T>
}

/**
 * FIXME: We should be using the disclosure pattern for navigation menus, *not* the menu pattern.
 *
 * @see https://w3c.github.io/aria-practices/#disclosure
 * @see https://w3c.github.io/aria-practices/examples/disclosure/disclosure-navigation.html
 * @see https://www.evinced.com/blog/a11y-nav-menus/
 */
export function NavigationMenu<T extends object>(props: NavigationMenuProps<T>): JSX.Element {
  const state = useMenuTriggerState(props)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { menuProps, menuTriggerProps } = useMenuTrigger({ type: 'menu' }, state, buttonRef)
  const { buttonProps } = useButton(menuTriggerProps, buttonRef)

  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', state.close)

    return () => {
      router.events.off('routeChangeStart', state.close)
    }
  }, [router, state.close])

  return (
    <div className={css['container']}>
      <button
        {...buttonProps}
        className={pageNavigationStyles['nav-menu-button']}
        data-state={state.isOpen ? 'expanded' : 'collapsed'}
        ref={buttonRef}
      >
        {props.label}
        <Icon icon={ChevronIcon} />
      </button>
      {state.isOpen ? (
        <FocusScope restoreFocus>
          <Popover isDismissable isOpen onClose={state.close} shouldCloseOnBlur>
            <DismissButton onDismiss={state.close} />
            <Menu
              {...props}
              menuProps={menuProps}
              aria-label={props.menuLabel ?? props.label}
              autoFocus={state.focusStrategy}
              onClose={state.close}
            />
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
    <ul {...mergeProps(menuProps, props.menuProps)} className={css['nav-menu']} ref={ref}>
      {[...state.collection].map((item) => {
        return (
          <MenuItem
            key={item.key}
            item={item}
            state={state}
            onAction={item.props.onAction}
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
  onAction?: () => void
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

  return (
    <li role="none">
      <NavLink
        ref={ref as RefObject<HTMLAnchorElement>}
        {...menuItemProps}
        href={item.props.href}
        onPress={onAction}
        variant="nav-menu-link"
      >
        {item.rendered}
      </NavLink>
    </li>
  )
}
