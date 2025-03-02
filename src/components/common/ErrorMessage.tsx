import { useTranslations } from 'next-intl'

import css from '@/components/common/ErrorMessage.module.css'

export interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
  /** @default 500 */
  statusCode?: number
}

export function ErrorMessage(props: ErrorMessageProps): JSX.Element {
  const t = useTranslations('common')

  const { message = t('default-error-message'), statusCode = 500 } = props

  return (
    <section role="alert" className={css['container']}>
      <p>{[statusCode, message].join(' - ')}</p>
    </section>
  )
}
