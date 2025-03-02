import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export type ItemFormDateFields = ReturnType<typeof useItemFormDateFields>

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useItemFormDateFields(prefix = '') {
  const t = useTranslations('authenticated')

  const fields = useMemo(() => {
    const fields = {
      dateCreated: {
        name: `${prefix}dateCreated`,
        label: t('fields.dateCreated.label'),
        description: t('fields.dateCreated.description'),
      },
      dateLastUpdated: {
        name: `${prefix}dateLastUpdated`,
        label: t('fields.dateLastUpdated.label'),
        description: t('fields.dateLastUpdated.description'),
      },
    }

    return fields
  }, [prefix, t])

  return fields
}
