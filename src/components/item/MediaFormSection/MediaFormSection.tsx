import { Dialog } from '@reach/dialog'
import get from 'lodash.get'
import { Fragment, useState } from 'react'

import type { ItemsDifferencesDto, MediaDetails } from '@/api/sshoc'
import { AddMediaForm } from '@/components/item/AddMediaForm/AddMediaForm'
import { Thumbnail } from '@/components/item/Thumbnail/Thumbnail'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormThumbnail } from '@/modules/form/components/FormThumbnail'
import { DiffControls } from '@/modules/form/diff/DiffControls'
import { DiffFieldArray } from '@/modules/form/diff/DiffFieldArray'
import helpText from '@@/config/form-helptext.json'

export interface MediaFormSectionProps {
  initialValues?: any
  prefix?: string
  diff?: ItemsDifferencesDto
}

/**
 * Form section for media uploads.
 */
export function MediaFormSection(props: MediaFormSectionProps): JSX.Element {
  const prefix = props.prefix ?? ''
  const isDiffingEnabled = props.diff != null && props.diff.equal === false
  const diff = props.diff ?? {}

  const mediaFieldArray = {
    name: `${prefix}media`,
    label: 'Media',
    approvedValue: get(diff.item, `${prefix}media`),
    suggestedValue: get(diff.other, `${prefix}media`),
    help: helpText['media-object'],
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  function openDialog() {
    setIsDialogOpen(true)
  }
  function closeDialog() {
    setIsDialogOpen(false)
  }

  return (
    <Fragment>
      <DiffFieldArray
        name={mediaFieldArray.name}
        approvedValue={mediaFieldArray.approvedValue}
        suggestedValue={mediaFieldArray.suggestedValue}
        actions={({ onAdd, arrayRequiresReview }) => {
          if (arrayRequiresReview === true) return null

          return (
            <Fragment>
              <FormFieldAddButton onPress={openDialog}>
                Add media
              </FormFieldAddButton>
              <AddMediaDialog
                isOpen={isDialogOpen}
                onDismiss={closeDialog}
                onSuccess={(info, caption) => onAdd({ info, caption })}
              />
            </Fragment>
          )
        }}
        isEnabled={isDiffingEnabled}
        wrapper={({ children }) => {
          return (
            <FormSection title={mediaFieldArray.label}>
              <ul className="grid grid-cols-3">{children}</ul>
            </FormSection>
          )
        }}
      >
        {({
          name,
          isReviewed,
          status,
          onApprove,
          onReject,
          approvedValue,
          suggestedValue,
          onRemove,
        }) => {
          const requiresReview = status !== 'unchanged' && !isReviewed

          const mediaField = {
            name: `${name}`,
            label: 'Media',
            approvedValue: approvedValue as any,
            suggestedValue: suggestedValue as any,
          }

          return (
            <Fragment>
              {requiresReview ? (
                <li className="py-2">
                  <DiffControls
                    status={status}
                    onApprove={onApprove}
                    onReject={onReject}
                  />
                  <Thumbnail
                    media={mediaField.suggestedValue?.info}
                    caption={mediaField.suggestedValue?.caption}
                    variant="form-diff"
                  />
                  <Thumbnail
                    media={mediaField.approvedValue?.info}
                    caption={mediaField.approvedValue?.caption}
                  />
                </li>
              ) : (
                <li>
                  <FormThumbnail name={name} onRemove={onRemove} />
                </li>
              )}
            </Fragment>
          )
        }}
      </DiffFieldArray>
    </Fragment>
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
