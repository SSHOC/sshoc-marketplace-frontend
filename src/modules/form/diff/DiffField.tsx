import { useState } from 'react'
import { useForm } from 'react-final-form'

import type { DiffFieldState } from '@/modules/form/diff/DiffFieldStateContext'
import { DiffFieldStateContext } from '@/modules/form/diff/DiffFieldStateContext'
import type { FieldStatus } from '@/modules/form/diff/types'

export interface DiffFieldProps {
  isEnabled: boolean
  name: string
  approvedValue: unknown
  suggestedValue: unknown
  onApprove?: () => void
  onReject?: () => void
  children: JSX.Element | ((state: DiffFieldState) => JSX.Element)
}

export function DiffField(props: DiffFieldProps): JSX.Element {
  const { isEnabled, name, approvedValue, suggestedValue } = props

  const form = useForm()
  const [status, setStatus] = useState<{
    status: FieldStatus
    isReviewed: boolean
    approvedValue: unknown
    suggestedValue: unknown
  }>(() => {
    if (!isEnabled) {
      return {
        approvedValue: null,
        suggestedValue: null,
        status: 'unchanged',
        isReviewed: true,
      }
    }

    return {
      approvedValue,
      suggestedValue,
      status: getStatus(approvedValue, suggestedValue, name),
      isReviewed: false,
    }
  })

  function onApprove() {
    /** Nothing to do, form is already populated with suggested values as initial values. */
    setStatus((status) => ({ ...status, isReviewed: true }))
    props.onApprove?.()
  }

  function onReject() {
    form.change(name, approvedValue)
    setStatus((status) => ({ ...status, isReviewed: true }))
    props.onReject?.()
  }

  const state: DiffFieldState = {
    name,
    ...status,
    onApprove,
    onReject,
    onRemove: () => null,
    index: -1,
  }

  return typeof props.children === 'function' ? (
    props.children(state)
  ) : (
    <DiffFieldStateContext.Provider value={state}>
      {props.children}
    </DiffFieldStateContext.Provider>
  )
}

/**
 * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/152#note_565636
 */
function getStatus(
  approvedValue: unknown,
  suggestedValue: unknown,
  name: string,
): FieldStatus {
  if (name.endsWith('version') || name.endsWith('sourceItemId')) {
    if (suggestedValue === 'unaltered') {
      return 'unchanged'
    }
  } else {
    if (suggestedValue == null) {
      return 'unchanged'
    }
  }

  if (suggestedValue == null) {
    return 'deleted'
  }
  if (approvedValue == null) {
    return 'inserted'
  }

  return 'changed'
}
