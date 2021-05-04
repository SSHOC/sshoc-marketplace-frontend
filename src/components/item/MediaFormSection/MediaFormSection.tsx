import { Dialog } from '@reach/dialog'
import { useState } from 'react'

import type { MediaDetails } from '@/api/sshoc'
import { useImportMedia, useUploadMedia } from '@/api/sshoc'
import { getMediaThumbnailUrl } from '@/api/sshoc/client'
import { Button } from '@/elements/Button/Button'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import DocumentIcon from '@/elements/icons/small/document.svg'
import { useToast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFileInput } from '@/modules/form/components/FormFileInput/FormFileInput'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { Form } from '@/modules/form/Form'
import { FormField } from '@/modules/form/FormField'
import { FormFieldArray } from '@/modules/form/FormFieldArray'
import { isUrl } from '@/modules/form/validate'

export interface MediaFormSectionProps {
  initialValues?: any
  prefix?: string
}

/**
 * Form section for media uploads.
 */
export function MediaFormSection(props: MediaFormSectionProps): JSX.Element {
  const prefix = props.prefix ?? ''

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
                      <FormField name={name}>
                        {({ input }) => {
                          const {
                            mediaId,
                            filename,
                            caption,
                            hasThumbnail,
                            location,
                          } = input.value

                          return (
                            <figure className="relative flex flex-col items-center p-2 space-y-2 w-80">
                              <button
                                onClick={() => fields.remove(index)}
                                className="absolute flex flex-col items-center justify-center transition bg-white border rounded cursor-default top-6 right-4 hover:bg-gray-200"
                              >
                                <span className="sr-only">Delete</span>
                                <Icon
                                  icon={CloseIcon}
                                  className="w-5 h-5 p-1"
                                />
                              </button>
                              {hasThumbnail === true ? (
                                <img
                                  src={getMediaThumbnailUrl({ mediaId })}
                                  alt=""
                                  className="object-contain w-full h-48 rounded shadow-md"
                                />
                              ) : (
                                <div className="grid object-contain w-full h-48 rounded shadow-md place-items-center">
                                  <img
                                    src={DocumentIcon}
                                    alt=""
                                    className="w-6 h-6"
                                  />
                                </div>
                              )}
                              <figcaption>
                                {caption ?? filename ?? location?.sourceUrl}
                              </figcaption>
                            </figure>
                          )
                        }}
                      </FormField>
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
                onSuccess={(mediaInfo, caption) =>
                  fields.push({ ...mediaInfo, caption })
                }
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
  onSuccess: (mediaInfo: MediaDetails, caption?: string) => void
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

type AddMediaFormValues = any // ImportMedia.RequestBody | UploadMedia.QueryParameters

interface AddMediaFormProps {
  onDismiss: () => void
  onSuccess: (mediaInfo: MediaDetails, caption?: string) => void
}

/**
 * Add media form.
 */
function AddMediaForm(props: AddMediaFormProps) {
  const auth = useAuth()
  const uploadMedia = useUploadMedia()
  const importMedia = useImportMedia()
  const toast = useToast()

  function onSubmit(values: AddMediaFormValues) {
    if (auth.session?.accessToken === undefined) {
      toast.error('Authentication required.')
      return Promise.reject()
    }

    const caption = values.caption

    const callbacks = {
      onSuccess(mediaInfo: MediaDetails) {
        props.onSuccess(mediaInfo, caption)
        toast.success('Sucessfully added media.')
      },
      onError() {
        toast.error('Failed to add media.')
      },
      onSettled() {
        props.onDismiss()
      },
    }

    if (values.files !== undefined) {
      if (values.files.length === 0) return
      const [file] = values.files
      const formData = new FormData()
      formData.set('file', file)
      uploadMedia.mutate(
        [
          // @ts-expect-error openapi document is wrong
          undefined,
          {
            token: auth.session.accessToken,
            hooks: {
              request(_request) {
                const request = new Request(_request, { body: formData })
                return request
              },
            },
          },
        ],
        callbacks,
      )
    } else {
      importMedia.mutate(
        [values, { token: auth.session.accessToken }],
        callbacks,
      )
    }
  }

  function onValidate(values: Partial<AddMediaFormValues>) {
    const errors: Partial<Record<keyof typeof values, any>> = {}

    if (values.sourceUrl !== undefined && !isUrl(values.sourceUrl)) {
      errors.sourceUrl = 'Must be a valid URL.'
    }
    if (
      values.sourceUrl !== undefined &&
      values.files !== undefined &&
      values.files.length > 0
    ) {
      errors.sourceUrl = errors.files =
        'Please choose between uploading a file, or importing a URL.'
    }

    return errors
  }

  return (
    <Form onSubmit={onSubmit} validate={onValidate}>
      {({ handleSubmit, pristine, invalid, submitting }) => {
        return (
          <form
            noValidate
            className="flex flex-col space-y-6"
            onSubmit={handleSubmit}
          >
            <FormFileInput
              name="files"
              accept="image/*,video/*"
              label="Upload media"
              variant="form"
              style={{ flex: 1 }}
            />
            <p>or</p>
            <FormTextField
              name="sourceUrl"
              label="Import media"
              variant="form"
              style={{ flex: 1 }}
              placeholder="https://"
            />
            <FormTextField
              name="caption"
              label="Caption"
              variant="form"
              style={{ flex: 1 }}
            />
            <div className="flex justify-end space-x-12">
              <Button variant="link" onPress={props.onDismiss}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                isLoading={uploadMedia.isLoading || importMedia.isLoading}
                isDisabled={
                  pristine ||
                  invalid ||
                  submitting ||
                  uploadMedia.isLoading ||
                  importMedia.isLoading
                }
              >
                Add
              </Button>
            </div>
          </form>
        )
      }}
    </Form>
  )
}
