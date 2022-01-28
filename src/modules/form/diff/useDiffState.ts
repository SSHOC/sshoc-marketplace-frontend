import { useState } from 'react'
import { useForm } from 'react-final-form'

export type Status = 'changed' | 'deleted' | 'inserted' | 'equal'

export interface DiffState {
  onApprove: () => void
  onReject: () => void
  requiresReview: boolean
  status: Status
}

export function useDiffState({
  name,
  approvedValue,
  suggestedValue,
  isArrayField,
}: {
  name: string
  approvedValue: unknown
  suggestedValue: unknown
  isArrayField?: boolean
}): DiffState {
  const form = useForm()
  const [isReviewed, setReviewed] = useState(false)

  /**
   * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/127#note_502140
   */
  function getStatus(): Status {
    /**
     * TODO: For array fields, we could check if the item is still in the list, but at another position.
     */
    if (isArrayField === true) {
      if (approvedValue != null && suggestedValue === null) {
        return 'equal'
      }
      if (approvedValue != null && suggestedValue != null) {
        return 'changed'
      }
      if (approvedValue == null && suggestedValue != null) {
        return 'inserted'
      }
      if (approvedValue != null && suggestedValue == null) {
        return 'deleted'
      }
      return 'equal'
    }

    if (approvedValue != null && suggestedValue != null) {
      return 'changed'
    }
    if (approvedValue == null && suggestedValue != null) {
      return 'inserted'
    }
    // FIXME: how are deleted scalar fields (e.g. `version`) represented, when `undefined` means `unchanged`?
    // if (approvedValue != null && suggestedValue == null) {
    //   return 'deleted'
    // }
    return 'equal'
  }

  const status = getStatus()
  const requiresReview = status !== 'equal' && !isReviewed

  function onApprove() {
    setReviewed(true)
  }

  function onReject() {
    form.change(name, approvedValue)
    setReviewed(true)
  }

  return {
    onApprove,
    onReject,
    requiresReview,
    status,
  }
}
