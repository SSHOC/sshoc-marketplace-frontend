import { useListBox } from '@react-aria/listbox'
import { mergeProps } from '@react-aria/utils'
import { Item, Section } from '@react-stately/collections'
import { useListState } from '@react-stately/list'
import type { AriaListBoxProps } from '@react-types/listbox'
import type {
  LabelableProps,
  NecessityIndicator,
  Validation,
} from '@react-types/shared'
import type { ReactNode } from 'react'
import { useRef } from 'react'

import { Separator } from '@/elements/Collection/Separator'
import { Field } from '@/elements/Field/Field'
import { ListBoxBase } from '@/elements/ListBoxBase/ListBoxBase'
import { useErrorMessage } from '@/modules/a11y/useErrorMessage'

export interface ListBoxProps<T>
  extends AriaListBoxProps<T>,
    Validation,
    LabelableProps {
  isDisabled?: boolean
  validationMessage?: ReactNode
  /** @default "icon" */
  necessityIndicator?: NecessityIndicator
  /** @default "default" */
  variant?: 'default' | 'search' | 'form'
}

/**
 * ListBox.
 */
/* eslint-disable-next-line @typescript-eslint/ban-types */
export function ListBox<T extends object>(props: ListBoxProps<T>): JSX.Element {
  const state = useListState<T>(props)
  const ref = useRef<HTMLUListElement>(null)
  const { labelProps, listBoxProps } = useListBox<T>(props, state, ref)
  const { fieldProps, errorMessageProps } = useErrorMessage(props)

  return (
    <Field
      label={props.label}
      labelProps={labelProps}
      labelElementType="span"
      isDisabled={props.isDisabled}
      isRequired={props.isRequired}
      necessityIndicator={props.necessityIndicator}
      validationState={props.validationState}
      validationMessage={props.validationMessage}
      errorMessageProps={errorMessageProps}
    >
      <ListBoxBase
        listBoxProps={mergeProps(listBoxProps, fieldProps)}
        listBoxRef={ref}
        state={state}
        isDisabled={props.isDisabled}
        isLoading={props.isLoading}
        variant={props.variant}
      />
    </Field>
  )
}

ListBox.Item = Item

ListBox.Section = Section

ListBox.Separator = Separator
