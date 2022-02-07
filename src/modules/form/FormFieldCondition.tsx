import type { ReactNode } from 'react'
import { Field } from 'react-final-form'

export interface FormFieldConditionProps {
  name: string
  condition: (value: any) => boolean
  children?: ReactNode
}

/**
 * Renders content conditionally on form field value.
 */
export function FormFieldCondition(props: FormFieldConditionProps): JSX.Element {
  return (
    <Field name={props.name} subscription={{ value: true }}>
      {({ input }) => {
        if (props.condition(input.value) === true) {
          return typeof props.children === 'function' ? props.children(input.value) : props.children
        }

        return null
      }}
    </Field>
  )
}
