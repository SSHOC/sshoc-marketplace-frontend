import { useObjectRef } from '@react-aria/utils'
import { useListState } from '@react-stately/list'
import type { AriaListBoxProps } from '@react-types/listbox'
import type { AsyncLoadable } from '@react-types/shared'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'

import { ListBoxBase } from '@/lib/core/ui/ListBox/ListBoxBase'
import { useListBoxLayout } from '@/lib/core/ui/ListBox/useListBoxLayout'

export interface ListBoxProps<T extends object> extends AriaListBoxProps<T>, AsyncLoadable {}

export const ListBox = forwardRef(function ListBox<T extends object>(
  props: ListBoxProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const state = useListState<T>(props)
  const layout = useListBoxLayout<T>(state)
  const ref = useObjectRef(forwardedRef)

  return <ListBoxBase<T> ref={ref} {...props} layout={layout} state={state} />
}) as <T extends object>(
  props: ListBoxProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element
