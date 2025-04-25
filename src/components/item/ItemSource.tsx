import { VisuallyHidden } from '@react-aria/visually-hidden'

import css from '@/components/item/ItemMetadata.module.css'
import type { Item } from '@/data/sshoc/api/item'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface ItemSourceProps {
  source: Item['source']
  id: Item['sourceItemId']
}

export function ItemSource(props: ItemSourceProps): JSX.Element | null {
  const { source, id } = props

  const { t } = useI18n<'common'>()

  if (source == null) {
    return null
  }

  return (
    <div>
      <dt>
        <VisuallyHidden>{t(['common', 'item', 'source', 'other'])}</VisuallyHidden>
      </dt>
      <dd className={css['value-group']}>
        <span className={css['value-group-label']}>{t(['common', 'item', 'source', 'one'])}:</span>
        <div className={css['value-group-items']}>
          <a
            href={id != null ? source.urlTemplate.replace('{source-item-id}', id) : undefined}
            target="_blank"
            rel="noreferrer"
            className={css['link']}
          >
            {source.label}
          </a>
        </div>
      </dd>
    </div>
  )
}
