import { useMemo } from 'react'

import { useI18n } from '@/lib/core/i18n/useI18n'

export type ConceptFormFields = ReturnType<typeof useConceptFormFields>

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useConceptFormFields(prefix = '') {
  const { t } = useI18n<'authenticated'>()

  const fields = useMemo(() => {
    const fields = {
      vocabulary: {
        name: `${prefix}vocabulary.code`,
        _root: `${prefix}vocabulary`,
        label: t(['authenticated', 'concepts', 'vocabulary', 'label']),
        description: t(['authenticated', 'concepts', 'vocabulary', 'description']),
        isRequired: true,
      },
      label: {
        name: `${prefix}label`,
        label: t(['authenticated', 'concepts', 'label', 'label']),
        description: t(['authenticated', 'concepts', 'label', 'description']),
        isRequired: true,
      },
      notation: {
        name: `${prefix}notation`,
        label: t(['authenticated', 'concepts', 'notation', 'label']),
        description: t(['authenticated', 'concepts', 'notation', 'description']),
      },
      definition: {
        name: `${prefix}definition`,
        label: t(['authenticated', 'concepts', 'definition', 'label']),
        description: t(['authenticated', 'concepts', 'definition', 'description']),
      },
    }

    return fields
  }, [prefix, t])

  return fields
}
