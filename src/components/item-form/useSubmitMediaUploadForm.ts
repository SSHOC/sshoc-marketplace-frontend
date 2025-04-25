import type { MediaUploadFormValues } from '@/components/item-form/MediaUploadForm'
import type { ItemMediaInput } from '@/data/sshoc/api/item'
import type { MediaDetails } from '@/data/sshoc/api/media'
import { useImportMedia, useUploadMedia } from '@/data/sshoc/hooks/media'
import { useI18n } from '@/lib/core/i18n/useI18n'
import type { MutationMetadata } from '@/lib/core/query/types'
import { isNonEmptyString } from '@/lib/utils'

export interface UseSubmitMediaUploadFormArgs {
  onClose: () => void
  onSuccess: (data: ItemMediaInput) => void
}

export type UseSubmitMediaUploadFormResult = (values: MediaUploadFormValues) => void

export function useSubmitMediaUploadForm(
  args: UseSubmitMediaUploadFormArgs,
): UseSubmitMediaUploadFormResult {
  const { t } = useI18n<'authenticated' | 'common'>()

  const meta: MutationMetadata = {
    messages: {
      mutate() {
        return t(['authenticated', 'media', 'upload-media-pending'])
      },
      success() {
        return t(['authenticated', 'media', 'upload-media-success'])
      },
      error() {
        return t(['authenticated', 'media', 'upload-media-error'])
      },
    },
  }
  const uploadMedia = useUploadMedia(undefined, { meta })
  const importMedia = useImportMedia(undefined, { meta })

  function onSubmit(values: MediaUploadFormValues) {
    args.onClose()

    const { file: fileList, sourceUrl, ...itemMedia } = values

    function onSuccess(data: MediaDetails) {
      const { mediaId } = data
      const values: ItemMediaInput = { info: { mediaId }, ...itemMedia }
      args.onSuccess(values)
    }

    if (isNonEmptyString(sourceUrl)) {
      importMedia.mutate({ data: { sourceUrl } }, { onSuccess })
    } else if (fileList != null && fileList.length > 0) {
       
      const file = fileList[0]!
      const formData = new FormData()
      formData.set('file', file)
      uploadMedia.mutate({ data: formData }, { onSuccess })
    }
  }

  return onSubmit
}
