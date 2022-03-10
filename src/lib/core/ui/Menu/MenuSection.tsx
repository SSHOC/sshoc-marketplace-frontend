import { useMenuSection } from '@react-aria/menu'
import { useSeparator } from '@react-aria/separator'
import type { TreeState } from '@react-stately/tree'
import type { Node } from '@react-types/shared'
import type { ForwardedRef, Key } from 'react'
import { forwardRef, Fragment } from 'react'
import useComposedRef from 'use-composed-ref'

import css from '@/lib/core/ui/Menu/Menu.module.css'

import { MenuItem } from './MenuItem'

export interface MenuSectionProps<T extends object> {
  item: Node<T>
  state: TreeState<T>
  onAction?: (key: Key) => void
  /** @default 'primary' */
  variant?: 'primary'
}

export const MenuSection = forwardRef(function MenuSection<T extends object>(
  props: MenuSectionProps<T>,
  forwardedRef: ForwardedRef<HTMLElement>,
): JSX.Element {
  const { item, state, onAction, variant } = props

  const { itemProps, headingProps, groupProps } = useMenuSection({
    heading: item.rendered,
    'aria-label': item['aria-label'],
  })

  const { separatorProps } = useSeparator({ elementType: 'li' })

  return (
    <Fragment>
      {item.key !== state.collection.getFirstKey() && (
        <li {...separatorProps} className={css['menu-separator']} />
      )}
      <li {...itemProps}>
        {item.rendered != null ? <span {...headingProps}>{item.rendered}</span> : null}
        <ul {...groupProps} className={css['menu-section']}>
          {[...item.childNodes].map((node) => {
            let item = (
              <MenuItem
                key={node.key}
                item={node}
                state={state}
                onAction={onAction}
                data-variant={variant}
              />
            )

            if (node.wrapper) {
              item = node.wrapper(item)
            }

            return item
          })}
        </ul>
      </li>
    </Fragment>
  )
}) as <T extends object>(
  props: MenuSectionProps<T> & { ref?: ForwardedRef<HTMLElement> },
) => JSX.Element
