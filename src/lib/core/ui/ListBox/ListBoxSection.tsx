import { useListBoxSection } from '@react-aria/listbox'
import {
  layoutInfoToStyle,
  useVirtualizerItem,
  type VirtualizerItemOptions,
} from '@react-aria/virtualizer'
import type { LayoutInfo } from '@react-stately/virtualizer'
import type { Node } from '@react-types/shared'
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, Fragment, useRef } from 'react'

import css from '@/lib/core/ui/ListBox/ListBoxBase.module.css'
import { useListBoxContext } from '@/lib/core/ui/ListBox/useListBoxContext'

export interface ListBoxSectionProps<T extends object>
  extends Omit<VirtualizerItemOptions, 'layoutInfo' | 'ref'> {
  layoutInfo: LayoutInfo
  headerLayoutInfo: LayoutInfo | null
  item: Node<T>
  children?: ReactNode
}

export const ListBoxSection = forwardRef(function ListBoxSection<T extends object>(
  props: ListBoxSectionProps<T>,
  _forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const { children, layoutInfo, headerLayoutInfo, virtualizer, item } = props
  const { headingProps, groupProps } = useListBoxSection({
    'aria-label': item['aria-label'],
    heading: item.rendered,
  })

  // const { separatorProps } = useSeparator({ elementType: 'li' })

  const headerRef = useRef<HTMLDivElement>(null)
  useVirtualizerItem({ layoutInfo: headerLayoutInfo!, virtualizer, ref: headerRef })

  const direction = 'ltr'
  const state = useListBoxContext<T>()

  return (
    <Fragment>
      {headerLayoutInfo ? (
        <div
          className={css['listbox-section']}
          role="presentation"
          ref={headerRef}
          style={layoutInfoToStyle(headerLayoutInfo, direction)}
        >
          {item.key !== state.collection.getFirstKey() && <div role="presentation" />}
          { }
          {item.rendered ? <div {...headingProps}>{item.rendered}</div> : null}
        </div>
      ) : null}
      <div {...groupProps} style={layoutInfoToStyle(layoutInfo, direction)}>
        {children}
      </div>
    </Fragment>
  )
}) as <T extends object>(
  props: ListBoxSectionProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element
