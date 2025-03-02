import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export type ConceptFormFields = ReturnType<typeof useConceptFormFields>

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useConceptFormFields(prefix = '') {
  const t = useTranslations('authenticated')

  const fields = useMemo(() => {
    const fields = {
      vocabulary: {
        name: `${prefix}vocabulary.code`,
        _root: `${prefix}vocabulary`,
        label: t('concepts.vocabulary.label'),
        description: t('concepts.vocabulary.description'),
        isRequired: true,
      },
      label: {
        name: `${prefix}label`,
        label: t('concepts.label.label'),
        description: t('concepts.label.description'),
        isRequired: true,
      },
      notation: {
        name: `${prefix}notation`,
        label: t('concepts.notation.label'),
        description: t('concepts.notation.description'),
      },
      definition: {
        name: `${prefix}definition`,
        label: t('concepts.definition.label'),
        description: t('concepts.definition.description'),
      },
    }

    return fields
  }, [prefix, t])

  return fields
}
