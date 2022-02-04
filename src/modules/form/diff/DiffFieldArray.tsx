import type { CSSProperties, ReactNode } from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'

import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import type { DiffFieldState } from '@/modules/form/diff/DiffFieldStateContext'
import { DiffFieldStateContext } from '@/modules/form/diff/DiffFieldStateContext'
import type { FieldStatus } from '@/modules/form/diff/types'

export interface DiffFieldArrayProps {
  isEnabled: boolean
  name: string
  approvedValue: Array<unknown>
  suggestedValue: Array<unknown>
  onApprove?: () => void
  onReject?: () => void
  children: JSX.Element | ((state: DiffFieldState) => JSX.Element)
  actions?: (props: {
    onAdd: (value?: any) => void
    arrayRequiresReview: boolean
  }) => ReactNode
  wrapper?: (props: {
    arrayRequiresReview: boolean
    children: ReactNode
  }) => JSX.Element
  style?: CSSProperties
}

export function DiffFieldArray(props: DiffFieldArrayProps): JSX.Element {
  const { isEnabled, name } = props

  const form = useForm()
  const { fields } = useFieldArray(name)
  const [status, setStatus] = useState<
    Array<{
      status: FieldStatus
      isReviewed: boolean
      approvedValue: unknown
      suggestedValue: unknown
    }>
  >(() => {
    if (!isEnabled) {
      return fields.map(() => ({
        approvedValue: null,
        suggestedValue: null,
        status: 'unchanged',
        isReviewed: true,
      }))
    }

    const suggested = props.suggestedValue.map((suggestedValue, index) => {
      const approvedValue = props.approvedValue[index]
      return {
        approvedValue,
        suggestedValue,
        status: getStatus(approvedValue, suggestedValue),
        isReviewed: false,
      }
    })
    /** Additional items are all deleted items. */
    const additional = props.approvedValue
      .slice(props.suggestedValue.length)
      .map((approvedValue) => {
        return {
          approvedValue,
          suggestedValue: undefined,
          status: getStatus(approvedValue, undefined),
          isReviewed: false,
        }
      })
    return [...suggested, ...additional]
  })

  /**
   * Add deleted fields to form field array, so we can reject deletions in random order,
   * without creating sparse arrays (which final-form-arrays does not allow).
   */
  const hasAddedDeletedFields = useRef(false)
  useEffect(() => {
    if (hasAddedDeletedFields.current === true) return
    hasAddedDeletedFields.current = true

    if (!isEnabled) return
    if (fields.length == null) return
    if (fields.length >= props.approvedValue.length) return

    Array.from({ length: props.approvedValue.length - fields.length }).forEach(
      () => {
        fields.push(null)
      },
    )
  }, [props.approvedValue, fields, isEnabled])

  const arrayRequiresReview =
    isEnabled &&
    status.some((field) => field.status !== 'unchanged' && !field.isReviewed)

  function onAdd(value = undefined) {
    fields.push(value)
  }

  const children = (
    <FormRecords>
      <div className="flex flex-col space-y-6" style={props.style}>
        {fields.map((name, index) => {
          const field = status[index] ?? {
            isReviewed: true,
            status: 'unchanged',
            approvedValue: null,
            suggestedValue: null,
          }

          function onApprove() {
            /** No need to change anything, since the field was never part of the form's initial values (= suggested values). */
            switch (field.status) {
              case 'deleted':
                fields.remove(index)
                setStatus((status) => [
                  ...status.slice(0, index),
                  /** Remove item from approved state, so we don't render the "additional", i.e. deleted field anymore, and don't have stale state when the user adds a new item. */
                  ...status.slice(index + 1),
                ])
                break
              case 'inserted':
              case 'changed':
                form.mutators.setFieldTouched(name)
                setStatus((status) => [
                  ...status.slice(0, index),
                  { ...status[index], isReviewed: true },
                  ...status.slice(index + 1),
                ])
                break
              default:
                return
            }
            props.onApprove?.()
          }

          function onReject() {
            switch (field.status) {
              case 'inserted':
                fields.remove(index)
                setStatus((status) => [
                  ...status.slice(0, index),
                  /** Remove item from approved state, so we don't render the "additional", i.e. deleted field anymore, and don't have stale state when the user adds a new item. */
                  ...status.slice(index + 1),
                ])
                break
              case 'deleted':
              case 'changed':
                fields.update(index, field.approvedValue)
                setStatus((status) => [
                  ...status.slice(0, index),
                  { ...status[index], isReviewed: true },
                  ...status.slice(index + 1),
                ])
                break
              default:
                return
            }
            props.onReject?.()
          }

          function onRemove() {
            fields.remove(index)
          }

          const state: DiffFieldState = {
            name,
            index,
            fields,
            ...field,
            onApprove,
            onReject,
            onRemove,
            arrayRequiresReview,
          }

          return typeof props.children === 'function' ? (
            <Fragment key={index}>{props.children(state)}</Fragment>
          ) : (
            <DiffFieldStateContext.Provider value={state} key={index}>
              {props.children}
            </DiffFieldStateContext.Provider>
          )
        })}
      </div>
      {typeof props.actions === 'function'
        ? props.actions({ onAdd, arrayRequiresReview })
        : null}
    </FormRecords>
  )

  return typeof props.wrapper === 'function'
    ? props.wrapper({ arrayRequiresReview, children })
    : children
}

/**
 * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/127#note_502140
 */
function getStatus(
  approvedValue: unknown,
  suggestedValue: unknown,
): FieldStatus {
  if (suggestedValue === null) {
    return 'unchanged'
  }

  if (approvedValue == null) {
    return 'inserted'
  }

  if (suggestedValue == null) {
    return 'deleted'
  }

  return 'changed'
}
