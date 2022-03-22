import { useFocusRing } from '@react-aria/focus'
import { isFocusVisible, useHover } from '@react-aria/interactions'
import { useOption } from '@react-aria/listbox'
import { mergeProps, useObjectRef } from '@react-aria/utils'
import type { Node } from '@react-types/shared'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'

import { Icon } from '@/lib/core/ui/Icon/Icon'
import CheckmarkIcon from '@/lib/core/ui/icons/checkmark.svg?symbol-icon'
import css from '@/lib/core/ui/ListBox/ListBoxBase.module.css'
import { useListBoxContext } from '@/lib/core/ui/ListBox/useListBoxContext'

export interface ListBoxOptionProps<T extends object> {
  item: Node<T>
  shouldFocusOnHover?: boolean
  shouldSelectOnPressUp?: boolean
  shouldUseVirtualFocus?: boolean
}

export const ListBoxOption = forwardRef(function ListBoxOption<T extends object>(
  props: ListBoxOptionProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const { item, shouldFocusOnHover, shouldSelectOnPressUp, shouldUseVirtualFocus } = props

  const { rendered, key } = item

  const state = useListBoxContext<T>()

  const ref = useObjectRef(forwardedRef)
  const { descriptionProps, isDisabled, isFocused, isSelected, labelProps, optionProps } =
    useOption<T>(
      {
        'aria-label': item['aria-label'],
        isVirtualized: true,
        key,
        shouldFocusOnHover,
        shouldSelectOnPressUp,
        shouldUseVirtualFocus,
      },
      state,
      ref,
    )
  // const { focusProps, isFocusVisible } = useFocusRing(props)
  const { hoverProps, isHovered } = useHover({ ...props, isDisabled })
  const isKeyboardModality = isFocusVisible()

  const isOptionFocused = shouldUseVirtualFocus === true && isFocused && isKeyboardModality
  const isOptionSelectable = state.selectionManager.selectionMode !== 'none'
  const isOptionHovered =
    (isHovered && shouldFocusOnHover !== true) || (isFocused && !isKeyboardModality)

  // TODO:
  // const contents = typeof rendered === 'string' ? <Text>{rendered}</Text> : rendered
  const contents = <span>{rendered}</span>

  return (
    <div
      ref={ref}
      {...mergeProps(optionProps, shouldFocusOnHover === true ? {} : hoverProps)}
      className={css['listbox-option']}
      data-focused={isOptionFocused === true ? '' : undefined}
      data-hovered={isOptionHovered === true ? '' : undefined}
      data-selectable={isOptionSelectable === true ? '' : undefined}
    >
      {contents}
      {isSelected ? <Icon icon={CheckmarkIcon} /> : null}
    </div>
  )
}) as <T extends object>(
  props: ListBoxOptionProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element
