import { createUrlSearchParams } from '@stefanprobst/request'
import { Fragment } from 'react'

import { ItemPreview } from '@/components/common/ItemPreview'
import { SectionTitle } from '@/components/common/SectionTitle'
import css from '@/components/home/LastUpdatedItems.module.css'
import { useItemSearch } from '@/data/sshoc/hooks/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'
import { maxLastAddedItems } from '~/config/sshoc.config'

import { SectionHeader } from '../common/SectionHeader'
import { SectionHeaderLink } from './SectionHeaderLink'

export function LastUpdatedItems(): JSX.Element {
  const { t } = useI18n<'common'>()
  const itemSearch = useItemSearch({ order: ['modified-on'], perpage: maxLastAddedItems })

  if (itemSearch.data == null) {
    return (
      <section className={css['container']}>
        <Centered>
          <LoadingIndicator />
        </Centered>
      </section>
    )
  }

  const lastUpdatedItems = itemSearch.data.items

  if (lastUpdatedItems.length === 0) {
    return <Fragment />
  }

  return (
    <section className={css['container']}>
      <SectionHeader>
        <SectionTitle>{t(['common', 'home', 'see-what-is-new'])}</SectionTitle>
        <SectionHeaderLink href={`/search?${createUrlSearchParams({ order: ['modified-on'] })}`}>
          {t(['common', 'see-all'])}
        </SectionHeaderLink>
      </SectionHeader>
      <section className={css['section']}>
        <ul role="list" className={css['items']}>
          {lastUpdatedItems.map((item) => {
            return (
              <li key={[item.persistentId, item.id].join('+')}>
                <ItemPreview item={item} headingLevel={4} />
              </li>
            )
          })}
        </ul>
      </section>
    </section>
  )
}
