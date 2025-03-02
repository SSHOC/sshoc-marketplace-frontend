import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export type MediaUploadFormFields = ReturnType<typeof useMediaUploadFormFields>

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useMediaUploadFormFields() {
  const t = useTranslations('authenticated')

  const fields = useMemo(() => {
    const fields = {
      file: {
        name: 'file',
        label: t('media.file.label'),
        description: t('media.file.description'),
      },
      sourceUrl: {
        name: 'sourceUrl',
        label: t('media.sourceUrl.label'),
        description: t('media.sourceUrl.description'),
      },
      caption: {
        name: 'caption',
        label: t('media.caption.label'),
        description: t('media.caption.description'),
      },
      licence: {
        name: 'concept.uri',
        _root: 'concept',
        label: t('media.licence.label'),
        description: t('media.licence.description'),
      },
    }

    return fields
  }, [t])

  return fields
}
