import { Fragment } from 'react'

import type { FormFieldConditionProps } from '@/modules/form/FormFieldCondition'
import { FormFieldCondition } from '@/modules/form/FormFieldCondition'

import { useDiffStateContext } from './DiffStateContext'

export interface DiffFormFieldConditionProps extends FormFieldConditionProps {
  approvedValue: any
  suggestedValue: any
}

export function DiffFormFieldCondition(
  props: DiffFormFieldConditionProps,
): JSX.Element {
  const { requiresReview } = useDiffStateContext()

  const isDifferent =
    props.condition(props.approvedValue) !==
    props.condition(props.suggestedValue)

  return (
    <Fragment>
      <FormFieldCondition {...props} />
      {requiresReview &&
      props.condition(props.approvedValue) === true &&
      isDifferent
        ? typeof props.children === 'function'
          ? props.children(props.approvedValue)
          : props.children
        : null}
    </Fragment>
  )
}
