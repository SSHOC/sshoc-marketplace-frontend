import type { AriaListBoxOptions } from '@react-aria/listbox'
import { useListBox } from '@react-aria/listbox'
import { mergeProps, useObjectRef } from '@react-aria/utils'
import { Virtualizer, VirtualizerItem } from '@react-aria/virtualizer'
import type { ListLayout } from '@react-stately/layout'
import type { ListState } from '@react-stately/list'
import type { ReusableView } from '@react-stately/virtualizer'
import type { AsyncLoadable, Node } from '@react-types/shared'
import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo, useRef } from 'react'
import useComposedRef from 'use-composed-ref'

import { useTranslations } from 'next-intl'
import css from '@/lib/core/ui/ListBox/ListBoxBase.module.css'
import { ListBoxContext } from '@/lib/core/ui/ListBox/ListBoxContext'
import { ListBoxOption } from '@/lib/core/ui/ListBox/ListBoxOption'
import { ListBoxSection } from '@/lib/core/ui/ListBox/ListBoxSection'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'

export interface ListBoxBaseStyleProps {
  '--listbox-background-color'?: CSSProperties['backgroundColor']
  '--listbox-border-color'?: CSSProperties['borderColor']
  '--listbox-border-width'?: CSSProperties['borderWidth']
  '--listbox-border-radius'?: CSSProperties['borderRadius']
  '--listbox-color'?: CSSProperties['color']
  '--listbox-font-size'?: CSSProperties['fontSize']
  '--listbox-font-weight'?: CSSProperties['fontWeight']
  '--listbox-padding-inline'?: CSSProperties['paddingInline']
  '--listbox-padding-block'?: CSSProperties['paddingBlock']
  '--listbox-section-background-color'?: CSSProperties['backgroundColor']
  '--listbox-section-color'?: CSSProperties['color']
  '--listbox-section-font-size'?: CSSProperties['fontSize']
  '--listbox-section-font-weight'?: CSSProperties['fontWeight']
  '--listbox-section-padding-inline'?: CSSProperties['paddingInline']
  '--listbox-section-padding-block'?: CSSProperties['paddingBlock']
  '--listbox-option-background-color'?: CSSProperties['backgroundColor']
  '--listbox-option-color'?: CSSProperties['color']
  '--listbox-option-background-color-focus'?: CSSProperties['backgroundColor']
  '--listbox-option-color-focus'?: CSSProperties['color']
  '--listbox-option-background-color-hover'?: CSSProperties['backgroundColor']
  '--listbox-option-color-hover'?: CSSProperties['color']
  '--listbox-option-background-color-selected'?: CSSProperties['backgroundColor']
  '--listbox-option-color-selected'?: CSSProperties['color']
  '--listbox-option-background-color-disabled'?: CSSProperties['backgroundColor']
  '--listbox-option-color-disabled'?: CSSProperties['color']
  '--listbox-option-font-size'?: CSSProperties['fontSize']
  '--listbox-option-font-weight'?: CSSProperties['fontWeight']
  '--listbox-option-padding-inline'?: CSSProperties['paddingInline']
  '--listbox-option-padding-block'?: CSSProperties['paddingBlock']
  '--listbox-option-checkmark-color'?: CSSProperties['color']
}

export interface ListBoxBaseProps<T extends object> extends AriaListBoxOptions<T>, AsyncLoadable {
  /** @default 'primary' */
  color?: 'form' | 'primary'
  domProps?: HTMLAttributes<HTMLElement>
  focusOnPointerEnter?: boolean
  layout: ListLayout<T>
  onScroll?: () => void
  renderEmptyState?: () => ReactNode
  // shouldSelectOnPressUp?: boolean
  state: ListState<T>
  style?: ListBoxBaseStyleProps
  transitionDuration?: number
}

export const ListBoxBase = forwardRef(function ListBoxBase<T extends object>(
  props: ListBoxBaseProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const {
    color = 'primary',
    domProps = {},
    focusOnPointerEnter,
    layout,
    onScroll,
    renderEmptyState,
    shouldSelectOnPressUp,
    shouldUseVirtualFocus,
    state,
    transitionDuration = 0,
  } = props

  const t = useTranslations('common')
  const listBoxRef = useRef<HTMLDivElement>(null)
  const { listBoxProps } = useListBox<T>(
    {
      ...props,
      isVirtualized: true,
      keyboardDelegate: layout,
    },
    state,
    listBoxRef,
  )

  layout.isLoading = props.isLoading === true

  type View = ReusableView<Node<T>, unknown>
  const renderWrapper = (
    parent: View | undefined,
    reusableView: View,
    children: Array<View>,
    renderChildren: (views: Array<View>) => Array<JSX.Element>,
  ): JSX.Element => {
    if (reusableView.viewType === 'section') {
      return (
        <ListBoxSection
          key={reusableView.key}
          item={reusableView.content!}
          layoutInfo={reusableView.layoutInfo!}
          virtualizer={reusableView.virtualizer}
          headerLayoutInfo={
            children.find((c) => {
              return c.viewType === 'header'
            })?.layoutInfo ?? null
          }
        >
          {renderChildren(
            children.filter((c) => {
              return c.viewType === 'item'
            }),
          )}
        </ListBoxSection>
      )
    }

    return (
      <VirtualizerItem
        key={reusableView.key}
        layoutInfo={reusableView.layoutInfo!}
        virtualizer={reusableView.virtualizer}
        parent={parent?.layoutInfo}
      >
        {reusableView.rendered}
      </VirtualizerItem>
    )
  }

  const _ref = useComposedRef(listBoxRef, forwardedRef)
  const ref = useObjectRef(_ref)

  const focusedKey = state.selectionManager.focusedKey
  const persistedKeys = useMemo(() => {
    return focusedKey != null ? new Set([focusedKey]) : null
  }, [focusedKey])

  return (
    <ListBoxContext.Provider value={state}>
      <Virtualizer
        ref={ref}
        {...mergeProps(listBoxProps, domProps)}
        className={css['listbox']}
        persistedKeys={persistedKeys}
        autoFocus={Boolean(props.autoFocus) || undefined}
        scrollDirection="vertical"
        collection={state.collection}
        data-color={color}
        layout={layout}
        // @ts-expect-error I guess it's fine.
        renderWrapper={renderWrapper}
        isLoading={props.isLoading}
        onLoadMore={props.onLoadMore}
        onScroll={onScroll}
        sizeToFit="height"
        transitionDuration={transitionDuration}
      >
        {(type, item: Node<T>) => {
          if (type === 'item') {
            return (
              <ListBoxOption
                item={item}
                shouldFocusOnHover={focusOnPointerEnter}
                shouldSelectOnPressUp={shouldSelectOnPressUp}
                shouldUseVirtualFocus={shouldUseVirtualFocus}
              />
            )
          } else if (type === 'loader') {
            return (
              <div
                /* eslint-disable-next-line jsx-a11y/role-has-required-aria-props */
                role="option"
                className={css['listbox-progress-spinner-container']}
              >
                <ProgressSpinner
                  aria-label={
                    // FIXME: use `loadingState`
                    state.collection.size > 0
                      ? t(['common', 'ui', 'listbox', 'loading-more'])
                      : t(['common', 'ui', 'listbox', 'loading'])
                  }
                  size="sm"
                />
              </div>
            )
          } else if (type === 'placeholder') {
            const emptyState = renderEmptyState?.()

            if (emptyState == null) {
              return null
            }

            return (
              /* eslint-disable-next-line jsx-a11y/role-has-required-aria-props */
              <div role="option" className={css['listbox-option-empty-state']}>
                {emptyState}
              </div>
            )
          }
          return null
        }}
      </Virtualizer>
    </ListBoxContext.Provider>
  )
}) as <T extends object>(
  props: ListBoxBaseProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element
