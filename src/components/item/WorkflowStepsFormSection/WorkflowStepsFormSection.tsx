import { Fragment } from 'react'

import type { ItemsDifferencesDto, StepCore, WorkflowCore } from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CrossIcon } from '@/elements/icons/small/cross.svg'
import { Svg as PlusIcon } from '@/elements/icons/small/plus.svg'
import { Svg as TriangleIcon } from '@/elements/icons/small/triangle.svg'
import { FormField } from '@/modules/form/FormField'
import { FormFieldArray } from '@/modules/form/FormFieldArray'

export interface ItemFormValues extends WorkflowCore {
  draft?: boolean
  composedOf?: Array<StepCore & { persistentId?: string }>
}

export interface WorkflowStepsFormSectionProps {
  onSetPage: (
    page: 'workflow' | 'steps' | 'step',
    prefix?: string,
    onReset?: () => void, // when step creation/editing is canceled
  ) => void
  diff?: ItemsDifferencesDto
}

/**
 * Form section for workflow steps.
 */
export function WorkflowStepsFormSection(
  props: WorkflowStepsFormSectionProps,
): JSX.Element {
  const isDiffingEnabled = props.diff != null && props.diff.equal === false
  const diff = props.diff ?? {}

  return (
    <section className="flex flex-col space-y-2">
      <FormFieldArray name="composedOf">
        {({ fields }) => {
          return (
            <Fragment>
              <FormField name="label" subscription={{ value: true }}>
                {({ input }) => {
                  return (
                    <div className="flex flex-col px-4 py-3 space-y-3 border border-gray-200 rounded bg-gray-75">
                      <h2 className="text-base font-bold text-gray-800 font-body">
                        {input.value}
                      </h2>
                      <div className="flex self-end space-x-8 text-primary-750">
                        <Button
                          onPress={() => {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            const lastIndex = fields.length!

                            fields.push(undefined)

                            props.onSetPage(
                              'step',
                              `${fields.name}.${lastIndex}.`,
                              () => {
                                fields.remove(lastIndex)
                              },
                            )
                          }}
                          variant="link"
                        >
                          <Icon icon={PlusIcon} className="w-2.5 h-2.5" />
                          <span>Add a step</span>
                        </Button>
                        <Button
                          onPress={() => {
                            props.onSetPage('workflow')
                          }}
                          variant="link"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  )
                }}
              </FormField>
              <div className="flex flex-col ml-8 space-y-2">
                {fields.map((name, index) => {
                  return (
                    <div
                      key={name}
                      className="flex flex-col px-4 py-3 space-y-3 border border-gray-200 rounded bg-gray-75"
                    >
                      <FormField
                        name={`${name}.label`}
                        subscription={{ value: true }}
                      >
                        {({ input }) => {
                          return (
                            <h3 className="text-base font-medium text-gray-800 font-body">
                              {input.value}
                            </h3>
                          )
                        }}
                      </FormField>
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
                          <Icon icon={TriangleIcon} className="w-2.5 h-2.5" />
                          <span>Move down</span>
                        </Button>
                        {/* <Button variant="link">
                          <Icon icon={PlusIcon} className="w-2.5 h-2.5" />
                          <span>Add a substep</span>
                        </Button> */}
                        <Button
                          onPress={() => {
                            fields.remove(index)
                          }}
                          variant="link"
                        >
                          <Icon icon={CrossIcon} className="w-2.5 h-2.5" />
                          <span>Delete</span>
                        </Button>
                        <Button
                          onPress={() => {
                            const currentValue = fields.value[index]
                            props.onSetPage(
                              'step',
                              `${fields.name}.${index}.`,
                              () => {
                                fields.update(index, currentValue)
                              },
                            )
                          }}
                          variant="link"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Fragment>
          )
        }}
      </FormFieldArray>
    </section>
  )
}
