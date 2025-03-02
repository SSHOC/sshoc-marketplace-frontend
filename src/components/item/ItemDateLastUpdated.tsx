import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { Timestamp } from '@/components/common/Timestamp'
import css from '@/components/item/ItemMetadata.module.css'
import type { IsoDateString } from '@/data/sshoc/lib/types'

export interface ItemDateLastUpdatedProps {
  dateTime?: IsoDateString
}

export function ItemDateLastUpdated(props: ItemDateLastUpdatedProps): JSX.Element {
  const { dateTime } = props

  const t = useTranslations('common')

  if (dateTime == null) {
    return <Fragment />
  }

  return (
    <div>
      <dt className={css['group-label']}>{t('item.date-last-modified')}</dt>
      <dd>
        <Timestamp dateTime={dateTime} />
      </dd>
    </div>
  )
}
