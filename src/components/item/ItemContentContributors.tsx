import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import css from '@/components/item/ItemMetadata.module.css'
import type { User } from '@/data/sshoc/api/user'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export interface ItemContentContributorsProps {
  contentContributors: Array<User> | undefined
}

export function ItemContentContributors(props: ItemContentContributorsProps): JSX.Element {
  const { contentContributors } = props

  const t = useTranslations('common')

  if (contentContributors == null) {
    return <LoadingIndicator />
  }

  if (contentContributors.length === 0) {
    return <Fragment />
  }

  return (
    <div className={css['group']}>
      <dt className={css['group-label']}>{t('item.content-contributors.other')}</dt>
      <dd>
        <ul role="list" className={css['group-items']}>
          {contentContributors.map((contributor) => {
            return (
              <li key={contributor.id}>
                <div>{contributor.displayName}</div>
              </li>
            )
          })}
        </ul>
      </dd>
    </div>
  )
}
