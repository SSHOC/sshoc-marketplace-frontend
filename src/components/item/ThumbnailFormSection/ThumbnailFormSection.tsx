import { Dialog } from '@reach/dialog'
import { Fragment, useState } from 'react'

import type { MediaDetails } from '@/api/sshoc'
import { AddMediaForm as AddThumbnailForm } from '@/components/item/AddMediaForm/AddMediaForm'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { MediaError } from '@/lib/error/MediaError'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormField } from '@/modules/form/FormField'

import { Thumbnail } from '../Thumbnail/Thumbnail'

export interface ThumbnailFormSectionProps {
  initialValues?: any
  prefix?: string
}

/**
 * Form section for choosing item thumbnail.
 */
export function ThumbnailFormSection(
  props: ThumbnailFormSectionProps,
): JSX.Element {
  const prefix = props.prefix ?? ''

  const addThumbnailDialog = useDialogState()
  const chooseThumbnailDialog = useDialogState()

  return (
    <FormSection title={'Thumbnail'}>
      <FormField name={`${prefix}thumbnail`}>
        {({ input }) => {
          return (
            <div>
              {input.value != null && input.value !== '' ? (
                <Thumbnail
                  onRemove={() => input.onChange(null)}
                  media={input.value}
                />
              ) : null}
              <div className="flex items-center space-x-8">
                <FormFieldAddButton onPress={addThumbnailDialog.open}>
                  {'Add new thumbnail'}
                </FormFieldAddButton>
                <AddThumbnailDialog
                  isOpen={addThumbnailDialog.isOpen}
                  onDismiss={addThumbnailDialog.close}
                  onSuccess={(mediaInfo, caption) => {
                    if (mediaInfo.category !== 'image') {
                      throw new MediaError('A thumbnail must be an image.')
                    }
                    input.onChange({ ...mediaInfo, caption })
                  }}
                />
                <div>or</div>
                <FormField name={`${prefix}media`}>
                  {({ input: media }) => {
                    const images =
                      media.value?.filter(
                        (m: MediaDetails) => m.category === 'image',
                      ) ?? []
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
                          onSuccess={(mediaInfo, caption) => {
                            input.onChange({ ...mediaInfo, caption })
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
    </FormSection>
  )
}

function useDialogState(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)
  function open() {
    setIsOpen(true)
  }
  function close() {
    setIsOpen(false)
  }
  return { isOpen, open, close }
}

interface DialogProps {
  isOpen: boolean
  onDismiss: () => void
  onSuccess?: (mediaInfo: MediaDetails, caption?: string) => void
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
  images: Array<MediaDetails & { caption?: string }>
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
  function onSubmit(image: MediaDetails & { caption?: string }) {
    props.onSuccess?.(image, image.caption)
    props.onDismiss()
  }

  return (
    <form noValidate>
      <ul className="grid grid-cols-2">
        {props.images.map((image) => {
          return (
            <li key={image.mediaId}>
              <button type="button" onClick={() => onSubmit(image)}>
                <Thumbnail media={image} caption={image.caption} />
              </button>
            </li>
          )
        })}
      </ul>
    </form>
  )
}
