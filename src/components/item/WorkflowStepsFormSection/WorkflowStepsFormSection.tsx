import { Fragment } from 'react'

import type { StepCore, WorkflowCore } from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CrossIcon } from '@/elements/icons/small/cross.svg'
import { Svg as PlusIcon } from '@/elements/icons/small/plus.svg'
import { Svg as TriangleIcon } from '@/elements/icons/small/triangle.svg'
import { FormField } from '@/modules/form/FormField'
import { FormFieldArray } from '@/modules/form/FormFieldArray'

import { ActorsFormSection } from '../ActorsFormSection/ActorsFormSection'
import { MainFormSection } from '../MainFormSection/MainFormSection'
import { PropertiesFormSection } from '../PropertiesFormSection/PropertiesFormSection'
import { RelatedItemsFormSection } from '../RelatedItemsFormSection/RelatedItemsFormSection'
import { SourceFormSection } from '../SourceFormSection/SourceFormSection'

export interface ItemFormValues extends WorkflowCore {
  draft?: boolean
  composedOf?: Array<StepCore & { persistentId?: string }>
}

export interface WorkflowStepsFormSectionProps {
  onPreviousPage: () => void
}

/**
 * Form section for workflow steps.
 */
export function WorkflowStepsFormSection(
  props: WorkflowStepsFormSectionProps,
): JSX.Element {
  return (
    <section className="flex flex-col space-y-2">
      <strong className="mb-6 text-error-500">
        Editing and creating workflow steps is not yet implemented.
      </strong>

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
                            fields.push(undefined)
                          }}
                          variant="link"
                        >
                          <Icon icon={PlusIcon} className="w-2.5 h-2.5" />
                          <span>Add a step</span>
                        </Button>
                        <Button onPress={props.onPreviousPage} variant="link">
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
                      <WorkflowStepForm name={name} />
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
                })}
              </div>
            </Fragment>
          )
        }}
      </FormFieldArray>
    </section>
  )
}

interface WorkflowStepFormProps {
  name: string
}

function WorkflowStepForm(props: WorkflowStepFormProps) {
  const prefix = props.name + '.'

  return (
    <section className="flex flex-col space-y-12">
      <MainFormSection prefix={prefix} />
      <ActorsFormSection prefix={prefix} />
      <PropertiesFormSection prefix={prefix} />
      <RelatedItemsFormSection prefix={prefix} />
      <SourceFormSection prefix={prefix} />
      <div className="flex items-center justify-end space-x-6">
        {/* <Button onPress={onCancel} variant="link">
          Cancel
        </Button>
        <Button type="submit" isDisabled={pristine || invalid}>
          Submit
        </Button> */}
      </div>
    </section>
  )
}
