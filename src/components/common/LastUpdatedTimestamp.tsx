import { useFormatter, useTranslations } from 'next-intl'

import css from '@/components/common/LastUpdatedTimestamp.module.css'
import type { IsoDateString } from '@/lib/core/types'

export interface LastUpdatedTimestampProps {
  dateTime: IsoDateString
}

export function LastUpdatedTimestamp(props: LastUpdatedTimestampProps): JSX.Element {
  const { dateTime } = props

  const t = useTranslations('common')
  const format = useFormatter()

  return (
    <time className={css['container']} dateTime={dateTime}>
      {t('item.last-updated-on', {
        date: format.dateTime(new Date(dateTime)),
      })}
    </time>
  )
}
