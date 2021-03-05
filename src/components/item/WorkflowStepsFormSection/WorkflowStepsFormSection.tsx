import React from 'react'
import { WorkflowCore } from '@/api/sshoc'
import { FormField } from '@/modules/form/FormField'
import { FormFieldArray } from '@/modules/form/FormFieldArray'

export interface ItemFormValues extends WorkflowCore {
  draft?: boolean
}

/**
 * Form section for workflow steps.
 */
export function WorkflowStepsFormSection(): JSX.Element {
  return (
    <section>
      <FormField name="label" subscription={{ value: true }}>
        {({ input }) => {
          return <h2>{input.value}</h2>
        }}
      </FormField>

      <strong>
        Editing and sorting workflow steps is not yet implemented.
      </strong>

      <FormFieldArray name="composedOf">
        {({ fields }) => {
          return (
            <div>
              {fields.map((name) => {
                return (
                  <FormField
                    key={name}
                    name={`${name}.label`}
                    subscription={{ value: true }}
                  >
                    {({ input }) => {
                      return <h3>{input.value}</h3>
                    }}
                  </FormField>
                )
              })}
            </div>
          )
        }}
      </FormFieldArray>
    </section>
  )
}
