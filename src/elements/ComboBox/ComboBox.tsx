import { useButton } from '@react-aria/button'
import { useComboBox } from '@react-aria/combobox'
import { useFilter } from '@react-aria/i18n'
import { useListBox } from '@react-aria/listbox'
import { mergeProps } from '@react-aria/utils'
import { Item, Section } from '@react-stately/collections'
import type { ComboBoxState } from '@react-stately/combobox'
import { useComboBoxState } from '@react-stately/combobox'
import type { ComboBoxProps as AriaComboBoxProps } from '@react-types/combobox'
import type {
  AriaLabelingProps,
  AsyncLoadable,
  LabelableProps,
  NecessityIndicator,
} from '@react-types/shared'
import cx from 'clsx'
import type { CSSProperties, HTMLAttributes, ReactNode, RefObject } from 'react'
import { useEffect, useRef } from 'react'

import { Separator } from '@/elements/Collection/Separator'
import { Field } from '@/elements/Field/Field'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CheckMarkIcon } from '@/elements/icons/small/checkmark.svg'
import { Svg as TriangleIcon } from '@/elements/icons/small/triangle.svg'
import { ListBoxBase } from '@/elements/ListBoxBase/ListBoxBase'
import { Popover } from '@/elements/Popover/Popover'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { useErrorMessage } from '@/modules/a11y/useErrorMessage'

export interface ComboBoxProps<T>
  extends AriaComboBoxProps<T>,
    AriaLabelingProps,
    LabelableProps,
    AsyncLoadable {
  name?: string
  validationMessage?: ReactNode
  helpText?: ReactNode
  /** @default "icon" */
  necessityIndicator?: NecessityIndicator
  // loadingState?: 'loading'
  shouldFocusWrap?: boolean
  allowsEmptyCollection?: boolean
  emptyCollectionPlaceholder?: string
  hideSelectionIcon?: boolean
  showSelectedItemIndicator?: boolean
  hideButton?: boolean
  /** @default "text" */
  type?: 'text' | 'search'
  /** @default "default" */
  variant?: 'default' | 'search' | 'form'
  style?: CSSProperties
}

/**
 * ComboBox.
 */
/* eslint-disable-next-line @typescript-eslint/ban-types */
export function ComboBox<T extends object>(
  props: ComboBoxProps<T>,
): JSX.Element {
  const { contains } = useFilter({ sensitivity: 'base' })
  const state = useComboBoxState<T>({ ...props, defaultFilter: contains })

  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxRef = useRef<HTMLUListElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const {
    buttonProps: triggerProps,
    inputProps,
    listBoxProps,
    labelProps,
  } = useComboBox<T>(
    {
      menuTrigger: 'input',
      ...props,
      inputRef,
      buttonRef: triggerRef,
      listBoxRef,
      popoverRef,
    },
    state,
  )
  const { errorMessageProps, fieldProps } = useErrorMessage(props)
  const { buttonProps } = useButton(triggerProps, triggerRef)

  const placeholder =
    props.allowsEmptyCollection === true
      ? props.isLoading === true
        ? 'Loading...'
        : props.emptyCollectionPlaceholder ?? 'No results'
      : undefined

  /**
   * When `items` are populated async, `useComboBoxState` does not correctly
   * update the `inputValue` with the selected item's label, because it only
   * tracks changes to `selectedKey`, but not changes to `selectedItem`, which
   * will be `null` initially, and changes once the `items` have been loaded.
   *
   * @see https://github.com/adobe/react-spectrum/issues/1645
   */
  const { inputValue, selectedItem, setInputValue } = state
  const lastSelectedItem = useRef(selectedItem)
  useEffect(() => {
    if (
      /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
      selectedItem != null &&
      inputValue === '' &&
      /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
      lastSelectedItem.current?.key !== selectedItem.key
    ) {
      setInputValue(selectedItem.textValue)
      lastSelectedItem.current = selectedItem
    }
  }, [inputValue, selectedItem, setInputValue])

  const isDisabled = props.isDisabled === true
  const isLoading = props.isLoading === true

  const variants = {
    default: {
      inputContainer: cx(
        'hover:bg-gray-90',
        state.isOpen ? 'bg-gray-90' : 'bg-white',
      ),
      input: '',
      button: cx('border-gray-300', state.isOpen && 'bg-white'),
      icon: 'text-primary-750',
    },
    search: {
      inputContainer: cx(
        'hover:bg-gray-90',
        state.isOpen ? 'bg-gray-90' : 'bg-white',
      ),
      input: '',
      button: cx('border-gray-300', state.isOpen && 'bg-white'),
      icon: 'text-primary-750',
    },
    form: {
      inputContainer: cx(
        'hover:border-secondary-600 focus:bg-highlight-75 focus:border-secondary-600',
        state.isOpen
          ? 'bg-highlight-75 border-secondary-600'
          : 'bg-gray-75 hover:bg-white',
        /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions */
        !state.selectedItem && 'group',
      ),
      input: state.isOpen && 'placeholder-highlight-300',
      button: 'border-transparent',
      icon: state.isOpen
        ? 'text-primary-750'
        : 'text-gray-800 hover:text-primary-750',
    },
  }

  const variant = variants[props.variant ?? 'default']
  const styles = {
    container: 'inline-flex relative',
    inputContainer: cx(
      'w-64',
      'transition inline-flex min-w-0 items-center justify-between rounded border border-gray-300',
      variant.inputContainer,
    ),
    input: cx(
      'min-w-0 flex-1 rounded-l font-body font-normal text-ui-base px-4 py-3 transition focus:outline-none bg-transparent placeholder-gray-350',
      isDisabled ? 'text-gray-350' : 'text-gray-800',
      isLoading && 'pr-0',
      variant.input,
    ),
    button: cx(
      'cursor-default rounded-r flex-shrink-0 px-3.5 border-l transition self-stretch inline-flex justify-center items-center',
      variant.button,
    ),
    icon: cx(
      'transition transform h-2.5 w-2.5',
      state.isOpen && 'rotate-180',
      variant.icon,
    ),
    spinnerContainer: 'inline-flex items-center justify-center mx-4',
    spinner: 'w-4 h-4 text-primary-750',
    check: 'w-3 h-3 text-success-600',
  }

  return (
    <Field
      label={props.label}
      labelProps={labelProps}
      isDisabled={props.isDisabled}
      isRequired={props.isRequired}
      necessityIndicator={props.necessityIndicator}
      validationState={props.validationState}
      validationMessage={props.validationMessage}
      helpText={props.helpText}
      errorMessageProps={errorMessageProps}
      style={props.style}
    >
      <div className={styles.container}>
        <div className={styles.inputContainer} style={props.style}>
          <input
            {...mergeProps(inputProps, fieldProps)}
            className={styles.input}
            ref={inputRef}
          />
          {isLoading ? (
            <span className={styles.spinnerContainer}>
              <ProgressSpinner className={styles.spinner} />
            </span>
          ) : null}
          {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
          {((typeof state.selectedKey === 'string' &&
            state.selectedKey.length > 0) ||
            typeof state.selectedKey === 'number') &&
          /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
          state.selectedItem?.textValue === state.inputValue && // only show indicator for selected item when it matches the current input. TODO: figure out how this should behave
          props.showSelectedItemIndicator === true ? (
            <span className={styles.spinnerContainer}>
              <Icon icon={CheckMarkIcon} className={styles.check} />
            </span>
          ) : null}
          {props.hideButton !== true ? (
            <button {...buttonProps} className={styles.button} ref={triggerRef}>
              <Icon icon={TriangleIcon} className={styles.icon} />
            </button>
          ) : null}
        </div>
        <Popover
          popoverRef={popoverRef}
          isOpen={state.isOpen}
          onClose={state.close}
          isDismissable
          shouldCloseOnBlur
          variant="combobox"
        >
          <ListBox
            shouldUseVirtualFocus
            listBoxRef={listBoxRef}
            menuProps={listBoxProps}
            state={state}
            isDisabled={props.isDisabled}
            // isLoading={props.isLoading}
            placeholder={placeholder}
            shouldFocusWrap={props.shouldFocusWrap}
            variant={props.variant}
            hideSelectionIcon={
              props.hideSelectionIcon ?? props.allowsCustomValue
            }
          />
        </Popover>
      </div>
    </Field>
  )
}

interface ListBoxProps<T> {
  shouldUseVirtualFocus?: boolean
  listBoxRef: RefObject<HTMLUListElement>
  state: ComboBoxState<T>
  menuProps: HTMLAttributes<HTMLElement>
  isDisabled?: boolean
  isLoading?: boolean
  placeholder?: string
  shouldFocusWrap?: boolean
  /** @default "default" */
  variant?: 'default' | 'search' | 'form'
  hideSelectionIcon?: boolean
}

/**
 * ListBox popover.
 *
 * @private
 */
/* eslint-disable-next-line @typescript-eslint/ban-types */
function ListBox<T extends object>(props: ListBoxProps<T>): JSX.Element {
  const { state, menuProps, shouldUseVirtualFocus } = props

  const ref = props.listBoxRef
  const { listBoxProps } = useListBox<T>(
    {
      ...menuProps,
      shouldFocusWrap: props.shouldFocusWrap,
      /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
      autoFocus: state.focusStrategy || true,
      disallowEmptySelection: true,
      /** Uses `aria-activedescendant` instead of actual focus. */
      /* @ts-expect-error Missing from upstream type. */
      shouldUseVirtualFocus,
    },
    state,
    ref,
  )

  // TODO: Highlight matching segments: put state.inputValue in closure
  // of highlighter function (which uses highlight-words-core).
  // Maybe pass down as a generic wrapListBoxItem function? or renderListBoxItemValue?

  return (
    <ListBoxBase
      listBoxProps={listBoxProps}
      listBoxRef={ref}
      state={state}
      isDisabled={props.isDisabled}
      isLoading={props.isLoading}
      placeholder={props.placeholder}
      variant={props.variant}
      shouldSelectOnPressUp
      shouldFocusOnHover
      shouldUseVirtualFocus={shouldUseVirtualFocus}
      hideSelectionIcon={props.hideSelectionIcon}
    />
  )
}

ComboBox.Item = Item

ComboBox.Section = Section

ComboBox.Separator = Separator
