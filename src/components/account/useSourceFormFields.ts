import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export type SourceFormFields = ReturnType<typeof useSourceFormFields>

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useSourceFormFields(prefix = '') {
  const t = useTranslations('authenticated')

  const fields = useMemo(() => {
    const fields = {
      label: {
        name: `${prefix}label`,
        label: t('sources.label.label'),
        description: t('sources.label.description'),
        isRequired: true,
      },
      url: {
        name: `${prefix}url`,
        label: t('sources.url.label'),
        description: t('sources.url.description'),
        isRequired: true,
      },
      urlTemplate: {
        name: `${prefix}urlTemplate`,
        label: t('sources.urlTemplate.label'),
        description: t('sources.urlTemplate.description'),
        isRequired: true,
      },
    }

    return fields
  }, [prefix, t])

  return fields
}
