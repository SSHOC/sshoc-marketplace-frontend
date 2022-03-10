import css from '@/components/common/ErrorMessage.module.css'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
  /** @default 500 */
  statusCode?: number
}

export function ErrorMessage(props: ErrorMessageProps): JSX.Element {
  const { t } = useI18n<'common'>()

  const { message = t(['common', 'default-error-message']), onRetry, statusCode = 500 } = props

  return (
    <section role="alert" className={css['container']}>
      <p>{[statusCode, message].join(' - ')}</p>
    </section>
  )
}
