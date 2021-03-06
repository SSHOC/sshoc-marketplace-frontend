import React from 'react'
import { WorkflowCore } from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CrossIcon } from '@/elements/icons/small/cross.svg'
import { Svg as PlusIcon } from '@/elements/icons/small/plus.svg'
import { Svg as TriangleIcon } from '@/elements/icons/small/triangle.svg'
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
    <section className="flex flex-col space-y-2">
      <strong className="mb-6 text-error-500">
        Editing and creating workflow steps is not yet implemented.
      </strong>

      <FormField name="label" subscription={{ value: true }}>
        {({ input }) => {
          return (
            <div className="flex flex-col px-4 py-3 border border-gray-200 rounded bg-gray-75">
              <h2 className="text-base font-bold text-gray-800 font-body">
                {input.value}
              </h2>
              <div className="flex self-end space-x-8 text-primary-750">
                <Button variant="link">
                  <Icon icon={PlusIcon} className="w-2.5 h-2.5" />
                  <span>Add a step</span>
                </Button>
                <Button variant="link">Edit</Button>
              </div>
            </div>
          )
        }}
      </FormField>

      <FormFieldArray name="composedOf">
        {({ fields }) => {
          return (
            <div className="flex flex-col ml-8 space-y-2">
              {fields.map((name, index) => {
                return (
                  <FormField
                    key={name}
                    name={`${name}.label`}
                    subscription={{ value: true }}
                  >
                    {({ input }) => {
                      return (
                        <div className="flex flex-col px-4 py-3 border border-gray-200 rounded bg-gray-75">
                          <h3 className="text-base font-medium text-gray-800 font-body">
                            {input.value}
                          </h3>
                          <div className="flex self-end space-x-8 text-primary-750">
                            <Button
                              onPress={() => {
                                fields.move(index, Math.max(0, index - 1))
                              }}
                              isDisabled={index === 0}
                              variant="link"
                            >
                              <Icon
                                icon={TriangleIcon}
                                className="w-2.5 h-2.5 transform rotate-180"
                              />
                              <span>Move up</span>
                            </Button>
                            <Button
                              onPress={() => {
                                fields.move(
                                  index,
                                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                  Math.min(fields.length! - 1, index + 1),
                                )
                              }}
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              isDisabled={index === fields.length! - 1}
                              variant="link"
                            >
                              <Icon
                                icon={TriangleIcon}
                                className="w-2.5 h-2.5"
                              />
                              <span>Move down</span>
                            </Button>
                            <Button variant="link">
                              <Icon icon={PlusIcon} className="w-2.5 h-2.5" />
                              <span>Add a substep</span>
                            </Button>
                            <Button
                              onPress={() => {
                                fields.remove(index)
                              }}
                              variant="link"
                            >
                              <Icon icon={CrossIcon} className="w-2.5 h-2.5" />
                              <span>Delete</span>
                            </Button>
                            <Button variant="link">Edit</Button>
                          </div>
                        </div>
                      )
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
