import { Timestamp } from '@/components/common/Timestamp'
import css from '@/components/item/ItemMetadata.module.css'
import type { IsoDateString } from '@/data/sshoc/lib/types'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface ItemDateCreatedProps {
  dateTime?: IsoDateString
}

export function ItemDateCreated(props: ItemDateCreatedProps): JSX.Element | null {
  const { dateTime } = props

  const { t } = useI18n<'common'>()

  if (dateTime == null) {
    return null
  }

  return (
    <div>
      <dt className={css['group-label']}>{t(['common', 'item', 'date-created'])}</dt>
      <dd>
        <Timestamp dateTime={dateTime} />
      </dd>
    </div>
  )
}
