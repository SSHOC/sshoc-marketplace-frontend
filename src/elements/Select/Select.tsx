import { useButton } from '@react-aria/button'
import { useMessageFormatter } from '@react-aria/i18n'
import { useListBox } from '@react-aria/listbox'
import { HiddenSelect, useSelect } from '@react-aria/select'
import { mergeProps } from '@react-aria/utils'
import { Item, Section } from '@react-stately/collections'
import type { SelectState } from '@react-stately/select'
import { useSelectState } from '@react-stately/select'
import type { AriaSelectProps } from '@react-types/select'
import type { NecessityIndicator } from '@react-types/shared'
import cx from 'clsx'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { useRef } from 'react'

import { Separator } from '@/elements/Collection/Separator'
import { Field } from '@/elements/Field/Field'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as TriangleIcon } from '@/elements/icons/small/triangle.svg'
import { ListBoxBase } from '@/elements/ListBoxBase/ListBoxBase'
import { Popover } from '@/elements/Popover/Popover'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import dictionary from '@/elements/Select/dictionary.json'
import { useErrorMessage } from '@/modules/a11y/useErrorMessage'

export interface SelectProps<T> extends AriaSelectProps<T> {
  name?: string
  validationMessage?: ReactNode
  helpText?: ReactNode
  /** @default "icon" */
  necessityIndicator?: NecessityIndicator
  shouldFocusWrap?: boolean
  hideSelectionIcon?: boolean
  /** @default "default" */
  variant?: 'default' | 'form-diff' | 'form' | 'search'
  /** @default "medium" */
  size?: 'medium' | 'small'
  isReadOnly?: boolean
  style?: CSSProperties
}

/**
 * Select.
 */

export function Select<T extends object>(props: SelectProps<T>): JSX.Element {
  const state = useSelectState<T>(props)
  const ref = useRef<HTMLButtonElement>(null)
  const { labelProps, menuProps, triggerProps, valueProps } = useSelect<T>(props, state, ref)
  const { buttonProps } = useButton(triggerProps, ref)
  const { fieldProps, errorMessageProps } = useErrorMessage(props)
  const t = useMessageFormatter(dictionary)

  const placeholder = props.placeholder ?? t('placeholder')
  /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
  const textValue = state.selectedItem ? state.selectedItem.rendered : placeholder

  const isLoading = props.isLoading === true
  const isLoadingInitial = isLoading && state.collection.size === 0

  /**
   * Clear current selection when item with `key === ''` is selected.
   * This means the placeholder text will be displayed, instead of
   * the label of the item with an empty string key.
   */
  // const { selectedKey, setSelectedKey } = state
  // const shouldClearOnEmptyStringKey = props.shouldClearOnEmptyStringKey === true
  // useEffect(() => {
  //   if (shouldClearOnEmptyStringKey && selectedKey === '') {
  //     /* @ts-expect-error Set null as key. */
  //     setSelectedKey(null)
  //   }
  // }, [shouldClearOnEmptyStringKey, selectedKey, setSelectedKey])

  const variants = {
    default: {
      button: cx('hover:bg-gray-90', state.isOpen ? 'bg-gray-90' : 'bg-white'),
      value: cx(
        /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
        !state.selectedItem && 'text-gray-350',
      ),
      iconContainer: cx('border-gray-300', state.isOpen && 'bg-white'),
      icon: 'text-primary-750',
    },
    search: {
      button: cx('hover:bg-gray-90', state.isOpen ? 'bg-gray-90' : 'bg-white'),
      value: cx(
        /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
        !state.selectedItem && 'text-gray-350',
      ),
      iconContainer: cx('border-gray-300', state.isOpen && 'bg-white'),
      icon: 'text-primary-750',
    },
    form: {
      button: cx(
        'hover:border-secondary-600 focus:bg-highlight-75 focus:border-secondary-600',
        state.isOpen ? 'bg-highlight-75 border-secondary-600' : 'bg-gray-75 hover:bg-white',
        /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
        !state.selectedItem && 'group',
      ),
      value: cx(
        /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
        !state.selectedItem &&
          (state.isOpen ? 'text-highlight-300' : 'text-gray-350 group-focus:text-highlight-300'),
      ),
      iconContainer: 'border-transparent',
      icon: state.isOpen ? 'text-primary-750' : 'text-gray-800 hover:text-primary-750',
    },
    'form-diff': {
      button: cx(
        'bg-[#EAFBFF] border border-[#92BFF5]',
        'hover:border-secondary-600 focus:bg-highlight-75 focus:border-secondary-600',
        state.isOpen ? 'bg-highlight-75 border-secondary-600' : 'bg-gray-75 hover:bg-white',
        /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
        !state.selectedItem && 'group',
      ),
      value: cx(
        /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
        !state.selectedItem &&
          (state.isOpen ? 'text-highlight-300' : 'text-gray-350 group-focus:text-highlight-300'),
      ),
      iconContainer: 'border-transparent',
      icon: state.isOpen ? 'text-primary-750' : 'text-gray-800 hover:text-primary-750',
    },
  }

  const sizes = {
    small: {
      button: 'w-56 text-ui-sm',
      value: 'px-3 py-2',
      iconContainer: 'px-2',
      icon: 'h-2 w-2',
    },
    medium: {
      button: 'w-64 text-ui-base',
      value: 'px-4 py-3',
      iconContainer: 'px-3.5',
      icon: 'h-2.5 w-2.5',
    },
  }

  const variant = variants[props.variant ?? 'default']
  const size = sizes[props.size ?? 'medium']
  const styles = {
    container: cx('relative inline-flex', props.isReadOnly === true && 'pointer-events-none'),
    button: cx(
      'cursor-default',
      'font-body font-normal text-gray-800 inline-flex items-center justify-between focus:outline-none',
      'transition rounded border border-gray-300 hover:text-primary-750',
      variant.button,
      size.button,
    ),
    value: cx('flex-1 text-left', isLoadingInitial && 'pr-0', variant.value, size.value),
    iconContainer: cx(
      'transition self-stretch inline-flex items-center justify-center border-l',
      variant.iconContainer,
      size.iconContainer,
    ),
    icon: cx('transition transform', state.isOpen && 'rotate-180', variant.icon, size.icon),
    spinnerContainer: 'inline-flex items-center justify-center',
    spinner: 'w-4 h-4 text-primary-750',
  }

  return (
    <Field
      label={props.label}
      labelProps={labelProps}
      isDisabled={props.isDisabled}
      isRequired={props.isRequired}
      isReadOnly={props.isReadOnly}
      necessityIndicator={props.necessityIndicator}
      validationState={props.validationState}
      validationMessage={props.validationMessage}
      helpText={props.helpText}
      errorMessageProps={errorMessageProps}
      style={props.style}
    >
      <div className={styles.container}>
        <button
          {...mergeProps(buttonProps, fieldProps)}
          className={styles.button}
          ref={ref}
          style={props.style}
        >
          <span {...valueProps} className={styles.value}>
            {textValue}
          </span>
          {isLoadingInitial ? (
            <span className={styles.spinnerContainer}>
              <ProgressSpinner className={styles.spinner} />
            </span>
          ) : null}
          <span className={styles.iconContainer}>
            <Icon icon={TriangleIcon} className={styles.icon} />
          </span>
        </button>
        <Popover
          isOpen={state.isOpen}
          onClose={state.close}
          isDismissable
          shouldCloseOnBlur
          variant="listbox"
        >
          <ListBox
            menuProps={menuProps}
            state={state}
            isDisabled={props.isDisabled}
            isLoading={props.isLoading}
            shouldFocusWrap={props.shouldFocusWrap}
            hideSelectionIcon={props.hideSelectionIcon}
            variant={props.variant}
          />
        </Popover>
        <HiddenSelect
          state={state}
          triggerRef={ref}
          label={props.label}
          name={props.name}
          isDisabled={props.isDisabled}
        />
      </div>
    </Field>
  )
}

interface ListBoxProps<T> {
  state: SelectState<T>
  menuProps: HTMLAttributes<HTMLElement>
  isDisabled?: boolean
  isLoading?: boolean
  shouldFocusWrap?: boolean
  hideSelectionIcon?: boolean
  /** @default "default" */
  variant?: 'default' | 'form-diff' | 'form' | 'search'
}

/**
 * ListBox popover.
 *
 * @private
 */

function ListBox<T extends object>(props: ListBoxProps<T>): JSX.Element {
  const { state, menuProps } = props

  const ref = useRef<HTMLUListElement>(null)
  const { listBoxProps } = useListBox<T>(
    {
      ...(menuProps as any),
      shouldFocusWrap: props.shouldFocusWrap,

      autoFocus: state.focusStrategy || true,
      disallowEmptySelection: true,
    },
    state,
    ref,
  )

  return (
    <ListBoxBase
      listBoxProps={listBoxProps}
      listBoxRef={ref}
      state={state}
      isDisabled={props.isDisabled}
      isLoading={props.isLoading}
      variant={props.variant === 'form-diff' ? 'form' : props.variant}
      hideSelectionIcon={props.hideSelectionIcon}
      shouldSelectOnPressUp
      shouldFocusOnHover
    />
  )
}

Select.Item = Item

Select.Section = Section

Select.Separator = Separator
