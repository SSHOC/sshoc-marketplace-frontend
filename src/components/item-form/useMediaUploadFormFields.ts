import { useMemo } from 'react'

import { useI18n } from '@/lib/core/i18n/useI18n'

export type MediaUploadFormFields = ReturnType<typeof useMediaUploadFormFields>

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useMediaUploadFormFields() {
  const { t } = useI18n<'authenticated'>()

  const fields = useMemo(() => {
    const fields = {
      file: {
        name: 'file',
        label: t(['authenticated', 'media', 'file', 'label']),
        description: t(['authenticated', 'media', 'file', 'description']),
      },
      sourceUrl: {
        name: 'sourceUrl',
        label: t(['authenticated', 'media', 'sourceUrl', 'label']),
        description: t(['authenticated', 'media', 'sourceUrl', 'description']),
      },
      caption: {
        name: 'caption',
        label: t(['authenticated', 'media', 'caption', 'label']),
        description: t(['authenticated', 'media', 'caption', 'description']),
      },
      licence: {
        name: 'concept.uri',
        _root: 'concept',
        label: t(['authenticated', 'media', 'licence', 'label']),
        description: t(['authenticated', 'media', 'licence', 'description']),
      },
    }

    return fields
  }, [t])

  return fields
}
