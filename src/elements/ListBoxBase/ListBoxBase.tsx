import { useListBoxSection, useOption } from '@react-aria/listbox'
import { useSeparator } from '@react-aria/separator'
import type { ListState } from '@react-stately/list'
import type { AsyncLoadable, Node } from '@react-types/shared'
import cx from 'clsx'
import type { HTMLAttributes, RefObject } from 'react'
import { Fragment, useRef } from 'react'

import { Icon } from '@/elements/Icon/Icon'
import { Svg as CheckMarkIcon } from '@/elements/icons/small/checkmark.svg'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { Separator } from '@/elements/Separator/Separator'

export interface ListBoxBaseProps<T> extends AsyncLoadable {
  listBoxProps: HTMLAttributes<HTMLElement>
  state: ListState<T>
  listBoxRef: RefObject<HTMLUListElement>
  isDisabled?: boolean
  placeholder?: string
  shouldSelectOnPressUp?: boolean
  shouldFocusOnHover?: boolean
  shouldUseVirtualFocus?: boolean
  /** @default "default" */
  variant?: 'default' | 'form' | 'search'
  hideSelectionIcon?: boolean
}

/**
 * Base component for ListBox and Select.
 *
 * @private
 */

export function ListBoxBase<T extends object>(props: ListBoxBaseProps<T>): JSX.Element {
  const { state, listBoxProps, listBoxRef } = props

  const isDisabled = props.isDisabled === true
  const isLoading = props.isLoading === true

  const items = Array.from(state.collection)
  const placeholder = state.collection.size === 0 ? props.placeholder : undefined

  const variant = props.variant ?? 'default'

  const styles = {
    list: cx(
      'w-full',
      'py-2 max-h-64 border border-gray-300 rounded overflow-x-hidden overflow-y-auto flex flex-col bg-white focus:outline-none',
      variant === 'search' ? '' : '',
    ),
    placeholder: 'font-body font-normal text-ui-base px-4 py-2 cursor-default select-none italic',
    loading: 'inline-flex items-center justify-center py-2 text-secondary-600',
    spinner: 'w-4 h-4',
  }

  return (
    <ul {...listBoxProps} ref={listBoxRef} className={styles.list}>
      {items.map((item, index) => {
        if (item.type === 'item') {
          return (
            <ListBoxItem
              key={item.key}
              item={item}
              state={state}
              isDisabled={isDisabled}
              variant={variant}
              shouldSelectOnPressUp={props.shouldSelectOnPressUp}
              shouldFocusOnHover={props.shouldFocusOnHover}
              shouldUseVirtualFocus={props.shouldUseVirtualFocus}
              hideSelectionIcon={props.hideSelectionIcon}
            />
          )
        }

        if (item.type === 'section') {
          return (
            <ListBoxSection
              key={item.key}
              section={item}
              state={state}
              isDisabled={isDisabled}
              variant={variant}
              shouldSelectOnPressUp={props.shouldSelectOnPressUp}
              shouldFocusOnHover={props.shouldFocusOnHover}
              shouldUseVirtualFocus={props.shouldUseVirtualFocus}
              hideSelectionIcon={props.hideSelectionIcon}
            />
          )
        }

        if (item.type === 'separator') {
          return (
            <li key={`separator-${index}`} role="none">
              <Separator />
            </li>
          )
        }

        return null
      })}
      {placeholder !== undefined ? (
        <li className={styles.placeholder} role="none">
          {placeholder}
        </li>
      ) : null}
      {isLoading ? (
        <div className={styles.loading}>
          <ProgressSpinner className={styles.spinner} />
        </div>
      ) : null}
    </ul>
  )
}

interface ListBoxItemProps<T> {
  state: ListState<T>
  item: Node<T>
  isDisabled?: boolean
  shouldSelectOnPressUp?: boolean
  shouldFocusOnHover?: boolean
  shouldUseVirtualFocus?: boolean
  /** @default "default" */
  variant?: 'default' | 'form' | 'search'
  hideSelectionIcon?: boolean
}

/**
 * ListBox item.
 *
 * @private
 */
function ListBoxItem<T>(props: ListBoxItemProps<T>): JSX.Element {
  const { state, item } = props

  const ref = useRef<HTMLLIElement>(null)
  const isDisabled = state.disabledKeys.has(item.key) || props.isDisabled === true
  const isSelected = state.selectionManager.isSelected(item.key)
  const { optionProps } = useOption(
    {
      key: item.key,
      isDisabled,
      isSelected,
      'aria-label': item['aria-label'],
      shouldSelectOnPressUp: props.shouldSelectOnPressUp,
      shouldFocusOnHover: props.shouldFocusOnHover,
      shouldUseVirtualFocus: props.shouldUseVirtualFocus,
    },
    state,
    ref,
  )

  /**
   * We cannot use `:focus` for focus styles in case of `shouldUseVirtualFocus`,
   * since with `aria-activedescendant` focus does not actually move.
   */
  const isFocused = state.selectionManager.focusedKey === item.key

  // const variant = props.variant ?? 'default'

  const styles = {
    item: cx(
      'transition font-body font-normal text-ui-base px-4 py-2 cursor-default select-none inline-flex items-center space-x-4 focus:outline-none',
      isDisabled
        ? 'pointer-events-none text-gray-350'
        : [
            'text-gray-800 hover:text-primary-750 hover:bg-gray-90 focus:bg-gray-90',
            isFocused && 'bg-gray-90',
          ],
      isSelected && 'text-primary-750',
    ),
    icon: 'w-3 h-3 text-primary-750 flex-shrink-0',
  }

  const checkMarkIcon =
    props.hideSelectionIcon === true ? null : isSelected ? (
      <Icon icon={CheckMarkIcon} className={styles.icon} />
    ) : (
      <div className={styles.icon} />
    )

  return (
    <li {...optionProps} ref={ref} className={styles.item}>
      {checkMarkIcon}
      <span>{item.rendered}</span>
    </li>
  )
}

interface ListBoxSectionProps<T> {
  state: ListState<T>
  section: Node<T>
  isDisabled?: boolean
  shouldSelectOnPressUp?: boolean
  shouldFocusOnHover?: boolean
  shouldUseVirtualFocus?: boolean
  /** @default "default" */
  variant?: 'default' | 'form' | 'search'
  hideSelectionIcon?: boolean
}

/**
 * ListBox section.
 *
 * @private
 */
function ListBoxSection<T>(props: ListBoxSectionProps<T>): JSX.Element {
  const { state, section, isDisabled } = props

  const { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  })
  const { separatorProps } = useSeparator({ elementType: 'li' })

  const items = Array.from(section.childNodes)

  const variant = props.variant ?? 'default'

  const styles = {
    separator: 'my-px h-px bg-gray-250',
    heading:
      'px-4 py-1 font-body font-normal text-ui-sm text-gray-550 uppercase tracking-wider select-none cursor-default inline-flex items-center justify-between',
    group: 'py-1 flex flex-col',
  }

  return (
    <Fragment>
      {section.key !== state.collection.getFirstKey() ? (
        <li {...separatorProps} className={styles.separator} />
      ) : null}
      <li {...itemProps}>
        <span {...headingProps} className={styles.heading}>
          {section.rendered}
        </span>
        <ul {...groupProps} className={styles.group}>
          {items.map((item) => {
            return (
              <ListBoxItem
                key={item.key}
                item={item}
                state={state}
                isDisabled={isDisabled}
                variant={variant}
                shouldSelectOnPressUp={props.shouldSelectOnPressUp}
                shouldFocusOnHover={props.shouldFocusOnHover}
                shouldUseVirtualFocus={props.shouldUseVirtualFocus}
                hideSelectionIcon={props.hideSelectionIcon}
              />
            )
          })}
        </ul>
      </li>
    </Fragment>
  )
}
