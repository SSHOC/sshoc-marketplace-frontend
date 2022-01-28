import { Dialog } from '@reach/dialog'
import get from 'lodash.get'
import { useState } from 'react'

import type { MediaDetails } from '@/api/sshoc'
import { AddMediaForm } from '@/components/item/AddMediaForm/AddMediaForm'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { DiffField } from '@/modules/form/diff/DiffField'
import { DiffThumbnail } from '@/modules/form/diff/DiffThumbnail'
import { FormFieldArray } from '@/modules/form/FormFieldArray'
import helpText from '@@/config/form-helptext.json'

export interface MediaFormSectionProps {
  initialValues?: any
  prefix?: string
  diff?: any
}

/**
 * Form section for media uploads.
 */
export function MediaFormSection(props: MediaFormSectionProps): JSX.Element {
  const prefix = props.prefix ?? ''
  const diff = props.diff ?? {}

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  function openDialog() {
    setIsDialogOpen(true)
  }
  function closeDialog() {
    setIsDialogOpen(false)
  }

  return (
    <FormSection title={'Media'}>
      <FormFieldArray name={`${prefix}media`}>
        {({ fields }) => {
          return (
            <div>
              <ul className="grid grid-cols-3">
                {fields.map((name, index) => {
                  return (
                    <li key={name}>
                      <DiffField
                        name={name}
                        approvedValue={get(diff.item, name)}
                        suggestedValue={get(diff.other, name)}
                        isArrayField
                        variant="media"
                      >
                        <DiffThumbnail
                          name={name}
                          approvedValue={get(diff.item, name)}
                          onRemove={() => fields.remove(index)}
                        />
                      </DiffField>
                    </li>
                  )
                })}
                {/* Items might have been deleted so the array will be shorter than in the approved version. */}
                {get(diff.item, `${prefix}media`)
                  .slice(fields.length)
                  .map((field: string, _index: number) => {
                    const index = (fields.length ?? 0) + _index
                    const name = `${prefix}media.${index}`

                    return (
                      <li key={name}>
                        <DiffField
                          name={name}
                          approvedValue={get(diff.item, name)}
                          suggestedValue={get(diff.other, name)}
                          isArrayField
                          variant="media"
                        >
                          <DiffThumbnail
                            name={name}
                            approvedValue={get(diff.item, name)}
                            onRemove={() => fields.remove(index)}
                          />
                        </DiffField>
                      </li>
                    )
                  })}
              </ul>
              <FormFieldAddButton onPress={openDialog}>
                {'Add media'}
              </FormFieldAddButton>
              <AddMediaDialog
                isOpen={isDialogOpen}
                onDismiss={closeDialog}
                onSuccess={(info, caption) => fields.push({ info, caption })}
              />
            </div>
          )
        }}
      </FormFieldArray>
    </FormSection>
  )
}

interface AddMediaDialogProps {
  isOpen: boolean
  onDismiss: () => void
  onSuccess?: (info: MediaDetails, caption?: string) => void
}

/**
 * Dialog to upload media or add media url.
 */
function AddMediaDialog(props: AddMediaDialogProps) {
  return (
    <Dialog
      isOpen={props.isOpen}
      onDismiss={props.onDismiss}
      aria-label="Add media"
      className="flex flex-col w-full max-w-screen-lg px-32 py-16 mx-auto bg-white rounded shadow-lg"
      style={{ width: '60vw', marginTop: '10vh', marginBottom: '10vh' }}
    >
      <button
        onClick={props.onDismiss}
        className="self-end"
        aria-label="Close dialog"
        type="button"
      >
        <Icon icon={CloseIcon} className="" />
      </button>
      <section className="flex flex-col space-y-6">
        <h2 className="text-2xl font-medium">Add media</h2>
        {/* this form is rendered in a portal, so it's valid html, even though it's a <form> "nested" in another <form>. */}
        <AddMediaForm onDismiss={props.onDismiss} onSuccess={props.onSuccess} />
      </section>
    </Dialog>
  )
}
