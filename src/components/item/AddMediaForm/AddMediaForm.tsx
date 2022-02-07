import type { MediaDetails } from '@/api/sshoc'
import { useImportMedia, useUploadMedia } from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { useToast } from '@/elements/Toast/useToast'
import { MediaError } from '@/lib/error/MediaError'
import { useAuth } from '@/modules/auth/AuthContext'
import { FormFileInput } from '@/modules/form/components/FormFileInput/FormFileInput'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { Form } from '@/modules/form/Form'
import { isUrl } from '@/modules/form/validate'

interface AddMediaFormValues {
  files?: FileList
  sourceUrl?: string
  caption?: string
}

interface AddMediaFormProps {
  onDismiss: () => void
  onSuccess?: (info: MediaDetails, caption?: string) => void
  accept?: string
}

/**
 * Add media form.
 */
export function AddMediaForm(props: AddMediaFormProps): JSX.Element {
  const auth = useAuth()
  const uploadMedia = useUploadMedia()
  const importMedia = useImportMedia()
  const toast = useToast()

  const accept = props.accept ?? 'image/*,video/*'

  function onSubmit(values: AddMediaFormValues) {
    if (auth.session?.accessToken === undefined) {
      toast.error('Authentication required.')
      return
    }

    const caption = values.caption

    const callbacks = {
      onSuccess(info: MediaDetails) {
        props.onSuccess?.(info, caption)
        toast.success('Sucessfully added media.')
      },
      onError(error: unknown) {
        toast.error(error instanceof MediaError ? error.message : 'Failed to add media.')
      },
      onSettled() {
        props.onDismiss()
      },
    }

    if (values.files !== undefined) {
      if (values.files.length === 0) return
      const file = values.files[0]
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
      importMedia.mutate([values, { token: auth.session.accessToken }], callbacks)
    }
  }

  function onValidate(values: Partial<AddMediaFormValues>) {
    const errors: Partial<Record<keyof typeof values, any>> = {}

    if (values.sourceUrl !== undefined && !isUrl(values.sourceUrl)) {
      errors.sourceUrl = 'Must be a valid URL.'
    }
    if (values.sourceUrl !== undefined && values.files !== undefined && values.files.length > 0) {
      errors.sourceUrl = errors.files =
        'Please choose between uploading a file, or importing a URL.'
    }

    return errors
  }

  return (
    <Form onSubmit={onSubmit} validate={onValidate}>
      {({ handleSubmit, pristine, invalid, submitting }) => {
        return (
          <form noValidate className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            <FormFileInput
              name="files"
              accept={accept}
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
            <FormTextField name="caption" label="Caption" variant="form" style={{ flex: 1 }} />
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
