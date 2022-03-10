import { useMemo } from 'react'

import { useI18n } from '@/lib/core/i18n/useI18n'

export type ItemFormDateFields = ReturnType<typeof useItemFormDateFields>

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useItemFormDateFields(prefix = '') {
  const { t } = useI18n<'authenticated'>()

  const fields = useMemo(() => {
    const fields = {
      dateCreated: {
        name: `${prefix}dateCreated`,
        label: t(['authenticated', 'fields', 'dateCreated', 'label']),
        description: t(['authenticated', 'fields', 'dateCreated', 'description']),
      },
      dateLastUpdated: {
        name: `${prefix}dateLastUpdated`,
        label: t(['authenticated', 'fields', 'dateLastUpdated', 'label']),
        description: t(['authenticated', 'fields', 'dateLastUpdated', 'description']),
      },
    }

    return fields
  }, [prefix, t])

  return fields
}
