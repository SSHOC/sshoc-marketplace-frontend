import { useListBoxSection } from '@react-aria/listbox'
import { useSeparator } from '@react-aria/separator'
import { layoutInfoToStyle, useVirtualizerItem } from '@react-aria/virtualizer'
import type { ReusableView } from '@react-stately/virtualizer'
import type { Node } from '@react-types/shared'
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, Fragment, useRef } from 'react'

import css from '@/lib/core/ui/ListBox/ListBoxBase.module.css'
import { useListBoxContext } from '@/lib/core/ui/ListBox/useListBoxContext'

export interface ListBoxSectionProps<T extends object> {
  children: ReactNode
  header: ReusableView<Node<T>, unknown>
  reusableView: ReusableView<Node<T>, unknown>
}

export const ListBoxSection = forwardRef(function ListBoxSection<T extends object>(
  props: ListBoxSectionProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const { children, header, reusableView } = props
  const item = reusableView.content
  const { headingProps, groupProps } = useListBoxSection({
    'aria-label': item['aria-label'],
    heading: item.rendered,
  })

  const { separatorProps } = useSeparator({ elementType: 'li' })

  const headerRef = useRef<HTMLDivElement>(null)
  useVirtualizerItem({ reusableView: header, ref: headerRef })

  const direction = 'ltr'
  const state = useListBoxContext<T>()

  return (
    <Fragment>
      <div
        ref={headerRef}
        className={css['listbox-section']}
        role="presentation"
        style={layoutInfoToStyle(header.layoutInfo, direction)}
      >
        {item.key !== state.collection.getFirstKey() ? <div {...separatorProps} /> : null}
        {item.rendered != null ? <div {...headingProps}>{item.rendered}</div> : null}
      </div>
      <div {...groupProps} style={layoutInfoToStyle(reusableView.layoutInfo, direction)}>
        {children}
      </div>
    </Fragment>
  )
}) as <T extends object>(
  props: ListBoxSectionProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element
