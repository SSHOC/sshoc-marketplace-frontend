import { useMemo } from 'react'

import { useI18n } from '@/lib/core/i18n/useI18n'

export interface UseReviewFieldLabelsResult {
  suggested: (label: string) => string
  current: (label: string) => string
}

export function useReviewFieldLabels(): UseReviewFieldLabelsResult {
  const { t } = useI18n<'authenticated' | 'common'>()

  const labels = useMemo(() => {
    const labels = {
      suggested(label: string) {
        return [label, t(['authenticated', 'review', '(suggested)'])].join(' ')
      },
      current(label: string) {
        return [label, t(['authenticated', 'review', '(current)'])].join(' ')
      },
    }

    return labels
  }, [t])

  return labels
}
