import { Dialog } from '@reach/dialog'
import get from 'lodash.get'
import { Fragment } from 'react'

import type { ItemsDifferencesDto, MediaDetails } from '@/api/sshoc'
import { AddMediaForm as AddThumbnailForm } from '@/components/item/AddMediaForm/AddMediaForm'
import { Thumbnail } from '@/components/item/Thumbnail/Thumbnail'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { MediaError } from '@/lib/error/MediaError'
import { useDialogState } from '@/lib/hooks/useDialogState'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { DiffControls } from '@/modules/form/diff/DiffControls'
import { DiffField } from '@/modules/form/diff/DiffField'
import { FormField } from '@/modules/form/FormField'
import helpText from '@@/config/form-helptext.json'

export interface ThumbnailFormSectionProps {
  initialValues?: any
  prefix?: string
  diff?: ItemsDifferencesDto
}

/**
 * Form section for choosing item thumbnail.
 */
export function ThumbnailFormSection(
  props: ThumbnailFormSectionProps,
): JSX.Element {
  const prefix = props.prefix ?? ''
  const isDiffingEnabled = props.diff != null && props.diff.equal === false
  const diff = props.diff ?? {}

  const addThumbnailDialog = useDialogState()
  const chooseThumbnailDialog = useDialogState()

  const thumbnailField = {
    name: `${prefix}thumbnail`,
    label: 'Thumbnail',
    approvedValue: get(diff.item, `${prefix}thumbnail`),
    suggestedValue: get(diff.other, `${prefix}thumbnail`),
    help: helpText.thumbnail,
  }

  return (
    <FormSection title={thumbnailField.label}>
      <DiffField
        name={thumbnailField.name}
        approvedValue={thumbnailField.approvedValue}
        suggestedValue={thumbnailField.suggestedValue}
        isEnabled={isDiffingEnabled}
      >
        {({
          name,
          isReviewed,
          status,
          onApprove,
          onReject,
          approvedValue,
          suggestedValue,
        }) => {
          const requiresReview = status !== 'unchanged' && !isReviewed

          return (
            <Fragment>
              {requiresReview ? (
                <div className="py-2">
                  <DiffControls
                    status={status}
                    onApprove={onApprove}
                    onReject={onReject}
                  />
                  <Thumbnail
                    media={(suggestedValue as any)?.info}
                    caption={(suggestedValue as any)?.caption}
                    variant="form-diff"
                  />
                  <Thumbnail
                    media={(approvedValue as any)?.info}
                    caption={(approvedValue as any)?.caption}
                  />
                </div>
              ) : (
                <FormField name={name}>
                  {({ input }) => {
                    return (
                      <div>
                        {input.value != null && input.value !== '' ? (
                          <div className="grid grid-cols-3">
                            <Thumbnail
                              onRemove={() => {
                                input.onChange(null)
                              }}
                              media={{
                                ...input.value.info,
                                hasThumbnail: true,
                              }}
                            />
                          </div>
                        ) : null}
                        <div className="flex items-center space-x-8">
                          <FormFieldAddButton onPress={addThumbnailDialog.open}>
                            {'Add new thumbnail'}
                          </FormFieldAddButton>
                          <AddThumbnailDialog
                            isOpen={addThumbnailDialog.isOpen}
                            onDismiss={addThumbnailDialog.close}
                            onSuccess={(info) => {
                              if (
                                info.category !== 'image' ||
                                info.hasThumbnail !== true
                              ) {
                                throw new MediaError(
                                  'A thumbnail must be an image.',
                                )
                              }
                              input.onChange({ info })
                            }}
                          />
                          <div>or</div>
                          <FormField name={`${prefix}media`}>
                            {({ input: media }) => {
                              const images = Array.isArray(media.value)
                                ? media.value.filter(
                                    (m: { info?: MediaDetails }) =>
                                      m.info?.category === 'image' &&
                                      m.info.hasThumbnail === true,
                                  )
                                : []
                              return (
                                <Fragment>
                                  <FormFieldAddButton
                                    isDisabled={images.length === 0}
                                    onPress={chooseThumbnailDialog.open}
                                  >
                                    {'Choose thumbnail from images'}
                                  </FormFieldAddButton>
                                  <ChooseThumbnailDialog
                                    isOpen={chooseThumbnailDialog.isOpen}
                                    onDismiss={chooseThumbnailDialog.close}
                                    onSuccess={(info) => {
                                      input.onChange({ info })
                                    }}
                                    images={images}
                                  />
                                </Fragment>
                              )
                            }}
                          </FormField>
                        </div>
                      </div>
                    )
                  }}
                </FormField>
              )}
            </Fragment>
          )
        }}
      </DiffField>
    </FormSection>
  )
}

interface DialogProps {
  isOpen: boolean
  onDismiss: () => void
  onSuccess?: (info: MediaDetails, caption?: string) => void
}

type AddThumbnailDialogProps = DialogProps

function AddThumbnailDialog(props: AddThumbnailDialogProps) {
  return (
    <Dialog
      isOpen={props.isOpen}
      onDismiss={props.onDismiss}
      aria-label="Add a new thumbnail"
      className="flex flex-col w-full max-w-screen-lg px-32 py-16 mx-auto bg-white rounded shadow-lg"
      style={{ width: '60vw', marginTop: '10vh', marginBottom: '10vh' }}
    >
      <button
        onClick={props.onDismiss}
        className="self-end"
        aria-label="Close dialog"
      >
        <Icon icon={CloseIcon} className="" />
      </button>
      <section className="flex flex-col space-y-6">
        <h2 className="text-2xl font-medium">Add thumbnail</h2>
        {/* this form is rendered in a portal, so it's valid html, even though it's a <form> "nested" in another <form>. */}
        <AddThumbnailForm
          onDismiss={props.onDismiss}
          onSuccess={props.onSuccess}
          accept="image/*"
        />
      </section>
    </Dialog>
  )
}

interface ChooseThumbnailDialogProps extends DialogProps {
  images: Array<{ info: MediaDetails; caption?: string }>
}

function ChooseThumbnailDialog(props: ChooseThumbnailDialogProps) {
  return (
    <Dialog
      isOpen={props.isOpen}
      onDismiss={props.onDismiss}
      aria-label="Choose a thumbnail from images"
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
        <h2 className="text-2xl font-medium">Choose thumbnail</h2>
        {/* this form is rendered in a portal, so it's valid html, even though it's a <form> "nested" in another <form>. */}
        <ChooseThumbnailForm
          onDismiss={props.onDismiss}
          onSuccess={props.onSuccess}
          images={props.images}
        />
      </section>
    </Dialog>
  )
}

interface ChooseThumbnailFormProps {
  onDismiss: ChooseThumbnailDialogProps['onDismiss']
  onSuccess: ChooseThumbnailDialogProps['onSuccess']
  images: ChooseThumbnailDialogProps['images']
}

function ChooseThumbnailForm(props: ChooseThumbnailFormProps) {
  function onSubmit(image: { info: MediaDetails; caption?: string }) {
    props.onSuccess?.(image.info, image.caption)
    props.onDismiss()
  }

  return (
    <form noValidate>
      <ul className="grid grid-cols-2">
        {props.images.map((image) => {
          return (
            <li key={image.info.mediaId}>
              <button type="button" onClick={() => onSubmit(image)}>
                <Thumbnail media={image.info} caption={image.caption} />
              </button>
            </li>
          )
        })}
      </ul>
    </form>
  )
}
