import { VisuallyHidden } from '@react-aria/visually-hidden'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import css from '@/components/item/ItemMetadata.module.css'
import type { Item } from '@/data/sshoc/api/item'

export interface ItemSourceProps {
  source: Item['source']
  id: Item['sourceItemId']
}

export function ItemSource(props: ItemSourceProps): JSX.Element {
  const { source, id } = props

  const t = useTranslations('common')

  if (source == null) {
    return <Fragment />
  }

  return (
    <div>
      <dt>
        <VisuallyHidden>{t('item.source.other')}</VisuallyHidden>
      </dt>
      <dd className={css['value-group']}>
        <span className={css['value-group-label']}>{t('item.source.one')}:</span>
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
