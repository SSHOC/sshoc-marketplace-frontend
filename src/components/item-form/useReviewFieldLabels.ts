import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export interface UseReviewFieldLabelsResult {
  suggested: (label: string) => string
  current: (label: string) => string
}

export function useReviewFieldLabels(): UseReviewFieldLabelsResult {
  const t = useTranslations('authenticated')

  const labels = useMemo(() => {
    const labels = {
      suggested(label: string) {
        return [label, t('review.(suggested)')].join(' ')
      },
      current(label: string) {
        return [label, t('review.(current)')].join(' ')
      },
    }

    return labels
  }, [t])

  return labels
}
