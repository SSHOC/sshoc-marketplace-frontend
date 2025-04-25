import { useComboBox } from '@react-aria/combobox'
import { useFocusRing } from '@react-aria/focus'
import { useFilter } from '@react-aria/i18n'
import { useHover } from '@react-aria/interactions'
import { DismissButton, useOverlayPosition } from '@react-aria/overlays'
import { mergeProps, useLayoutEffect, useResizeObserver } from '@react-aria/utils'
import { useComboBoxState } from '@react-stately/combobox'
import type { AriaButtonProps } from '@react-types/button'
import type { AriaComboBoxProps } from '@react-types/combobox'
import type { Placement } from '@react-types/overlays'
import type {
  Alignment,
  AriaLabelingProps,
  AsyncLoadable,
  LabelableProps,
  LabelPosition,
  LoadingState,
  NecessityIndicator,
} from '@react-types/shared'
import type { ForwardedRef, InputHTMLAttributes, RefObject } from 'react'
import { forwardRef, Fragment, useCallback, useEffect, useRef, useState } from 'react'
import useComposedRef from 'use-composed-ref'

import { useI18n } from '@/lib/core/i18n/useI18n'
import css from '@/lib/core/ui/ComboBox/ComboBox.module.css'
import { Field } from '@/lib/core/ui/Field/Field'
import { FieldButton } from '@/lib/core/ui/FieldButton/FieldButton'
// import { useIsMobileDevice } from '@/lib/core/ui/hooks/useIsMobileDevice'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import ChevronIcon from '@/lib/core/ui/icons/chevron.svg?symbol-icon'
import { ListBoxBase } from '@/lib/core/ui/ListBox/ListBoxBase'
import type { ListBoxHeights } from '@/lib/core/ui/ListBox/useListBoxLayout'
import { useListBoxLayout } from '@/lib/core/ui/ListBox/useListBoxLayout'
import { Popover } from '@/lib/core/ui/Popover/Popover'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'
import { TextFieldBase } from '@/lib/core/ui/TextField/TextFieldBase'

export interface ComboBoxProps<T extends object>
  extends AriaComboBoxProps<T>,
    LabelableProps,
    AriaLabelingProps,
    Omit<AsyncLoadable, 'isLoading'> {
  /** @default 'primary' */
  color?: 'form' | 'primary'
  /** @default 'bottom' */
  direction?: 'bottom' | 'top'
  isRequired?: boolean
  maxHeight?: number
  name?: string
  /** @default 'start' */
  labelAlign?: Alignment
  labelPosition?: LabelPosition
  layout?: ListBoxHeights<T>
  loadingState?: LoadingState
  /** @default 'icon' */
  necessityIndicator?: NecessityIndicator
  shouldFlip?: boolean
  /** @default 'md' */
  size?: 'md' | 'sm'
}

export const ComboBox = forwardRef(function ComboBox<T extends object>(
  props: ComboBoxProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  // const isMobile = useIsMobileDevice()

  // if (isMobile) {
  //   return <MobileComboBox ref={forwardedRef} {...props} menuTrigger="input" />
  // } else {
  //   return <ComboBoxBase ref={forwardedRef} {...props} />
  // }

  return <ComboBoxBase ref={forwardedRef} {...props} />
}) as <T extends object>(
  props: ComboBoxProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element

const ComboBoxBase = forwardRef(function ComboBoxBase<T extends object>(
  props: ComboBoxProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const {
    color = 'primary',
    direction = 'bottom',
    layout: _layout,
    loadingState,
    maxHeight,
    menuTrigger = 'input',
    onLoadMore,
    shouldFlip = true,
    size = 'md',
  } = props

  const { t } = useI18n<'common'>()
  const isAsync = loadingState != null
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)

  const { contains } = useFilter({ sensitivity: 'base' })
  const state = useComboBoxState<T>({
    ...props,
    allowsEmptyCollection: isAsync,
    defaultFilter: contains,
  })
  const layout = useListBoxLayout<T>(state, _layout)

  const { buttonProps, inputProps, listBoxProps, labelProps, descriptionProps, errorMessageProps } =
    useComboBox<T>(
      {
        ...props,
        buttonRef,
        inputRef,
        keyboardDelegate: layout,
        listBoxRef,
        menuTrigger,
        popoverRef,
      },
      state,
    )

  const { overlayProps, placement, updatePosition } = useOverlayPosition({
    isOpen: state.isOpen,
    maxHeight,
    onClose: state.close,
    overlayRef: popoverRef,
    placement: `${direction} end` as Placement,
    scrollRef: listBoxRef,
    shouldFlip: shouldFlip,
    targetRef: buttonRef,
  })

  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined)

  const onResize = useCallback(() => {
    if (buttonRef.current && inputRef.current) {
      const buttonWidth = buttonRef.current.offsetWidth
      const inputWidth = inputRef.current.offsetWidth
      setMenuWidth(buttonWidth + inputWidth)
    }
  }, [buttonRef, inputRef, setMenuWidth])

  useResizeObserver({ onResize, ref: fieldRef })

  useLayoutEffect(onResize, [onResize])

  // Update position once the ListBox has rendered. This ensures that
  // it flips properly when it doesn't fit in the available space.
  // TODO: add ResizeObserver to useOverlayPosition so we don't need this.
  useLayoutEffect(() => {
    if (state.isOpen) {
      requestAnimationFrame(() => {
        updatePosition()
      })
    }
  }, [state.isOpen, updatePosition])

  const style = {
    ...overlayProps.style,
    minWidth: menuWidth,
    width: menuWidth,
  }

  // TODO: Should expose imperative handle to focus input element.
  const ref = useComposedRef(fieldRef, forwardedRef)

  return (
    <Fragment>
      <Field
        ref={ref}
        {...props}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        labelProps={labelProps}
      >
        <ComboBoxInput
          {...props}
          color={color}
          size={size}
          inputProps={inputProps}
          inputRef={inputRef}
          isOpen={state.isOpen}
          loadingState={loadingState}
          triggerProps={buttonProps}
          triggerRef={buttonRef}
        />
      </Field>
      <Popover
        ref={popoverRef}
        hideArrow
        isDismissable={false}
        isNonModal
        isOpen={state.isOpen}
        placement={placement}
        style={style}
      >
        <ListBoxBase<T>
          ref={listBoxRef}
          {...listBoxProps}
          autoFocus={state.focusStrategy}
          color={color}
          disallowEmptySelection
          focusOnPointerEnter
          isLoading={loadingState === 'loadingMore'}
          layout={layout}
          onLoadMore={onLoadMore}
          renderEmptyState={() => {
            if (isAsync !== true) {return null}

            return (
              <span>
                {loadingState === 'loading'
                  ? t(['common', 'ui', 'combobox', 'loading'])
                  : t(['common', 'ui', 'combobox', 'no-results'])}
              </span>
            )
          }}
          shouldSelectOnPressUp
          shouldUseVirtualFocus
          // size={size}
          state={state}
        />
        <DismissButton
          onDismiss={() => {
            state.close()
          }}
        />
      </Popover>
    </Fragment>
  )
}) as <T extends object>(
  props: ComboBoxProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element

interface ComboBoxInputProps<T extends object> extends AriaComboBoxProps<T> {
  /** @default 'primary' */
  color?: 'form' | 'primary'
  inputProps: InputHTMLAttributes<HTMLInputElement>
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
  isOpen?: boolean
  loadingState?: LoadingState
  /** @default 'md' */
  size?: 'md' | 'sm'
  triggerProps: AriaButtonProps
  triggerRef: RefObject<HTMLButtonElement>
}

const ComboBoxInput = forwardRef(function ComboBoxInput<T extends object>(
  props: ComboBoxInputProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const {
    color = 'primary',
    inputProps,
    inputRef,
    isDisabled,
    isOpen,
    loadingState,
    menuTrigger,
    size = 'md',
    triggerProps,
    triggerRef,
    validationState,
  } = props
  const { hoverProps, isHovered } = useHover(props)
  const { focusProps, isFocusVisible } = useFocusRing({
    ...props,
    isTextInput: true,
    within: true,
  })
  const timeout = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const [showLoading, setShowLoading] = useState(false)

  const loadingCircle = <ProgressSpinner size="sm" />

  const isLoading = loadingState === 'loading' || loadingState === 'filtering'
  const inputValue = inputProps.value as string
  const lastInputValue = useRef<string>(inputValue)
  // TODO: check this, also: same as in SearchAutocomplete
  useEffect(() => {
    if (isLoading && !showLoading) {
      if (timeout.current == null) {
        timeout.current = setTimeout(() => {
          setShowLoading(true)
        }, 500)
      }

      if (inputValue !== lastInputValue.current) {
        clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
          setShowLoading(true)
        }, 500)
      }
    } else if (!isLoading) {
      setShowLoading(false)
      if (timeout.current != null) {
        clearTimeout(timeout.current)
        timeout.current = null
      }
    }

    lastInputValue.current = inputValue
  }, [isLoading, showLoading, inputValue])

  return (
    <div
      ref={forwardedRef}
      {...mergeProps(focusProps, hoverProps)}
      className={css['combobox-input-group']}
      data-color={color}
      data-active={isOpen === true ? '' : undefined}
      data-focused={isFocusVisible ? '' : undefined}
      data-hovered={isHovered ? '' : undefined}
      data-open={isOpen}
      data-size={size}
    >
      <TextFieldBase
        color={color}
        inputProps={inputProps}
        inputRef={inputRef}
        isDisabled={isDisabled}
        isLoading={
          // eslint-disable-next-line react/jsx-no-leaked-render
          showLoading && (isOpen === true || menuTrigger === 'manual' || loadingState === 'loading')
        }
        loadingIndicator={loadingState != null ? loadingCircle : undefined}
        size={size}
        validationState={validationState}
      />
      <FieldButton
        ref={triggerRef}
        {...triggerProps}
        color={color}
        isActive={isOpen}
        preventFocusOnPress
        // size={size}
        validationState={validationState}
      >
        <Icon icon={ChevronIcon} />
      </FieldButton>
    </div>
  )
}) as <T extends object>(
  props: ComboBoxInputProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element
