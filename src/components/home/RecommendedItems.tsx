import { createUrlSearchParams } from '@stefanprobst/request'
import { Fragment } from 'react'

import { ItemPreview } from '@/components/common/ItemPreview'
import { SectionTitle } from '@/components/common/SectionTitle'
import css from '@/components/home/RecommendedItems.module.css'
import { SectionHeader } from '@/components/home/SectionHeader'
import { SectionHeaderLink } from '@/components/home/SectionHeaderLink'
import { useItemSearch } from '@/data/sshoc/hooks/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'
import { maxRecommendedItems } from '~/config/sshoc.config'

export function RecommendedItems(): JSX.Element {
  const { t } = useI18n<'common'>()

  return (
    <section className={css['container']}>
      <SectionHeader>
        <SectionTitle>{t(['common', 'home', 'recommended'])}</SectionTitle>
        <SectionHeaderLink
          href={`/search?${createUrlSearchParams({ 'f.keyword': 'recommended', order: ['modified-on'] })}`}
        >
          {t(['common', 'see-all'])}
        </SectionHeaderLink>
      </SectionHeader>
      <ul role="list" className={css['sections']}>
        <ItemsRecommended />
      </ul>
    </section>
  )
}

function ItemsRecommended(): JSX.Element {
  const itemSearch = useItemSearch({
    'f.keyword': ['recommended'],
    order: ['modified-on'],
    perpage: maxRecommendedItems,
  })

  if (itemSearch.data == null) {
    return (
      <Centered elementType="li">
        <LoadingIndicator />
      </Centered>
    )
  }

  const recommendedItems = itemSearch.data.items

  if (recommendedItems.length === 0) {
    return <Fragment />
  }

  return (
    <li>
      <section className={css['section']}>
        <ul role="list" className={css['items']}>
          {recommendedItems.map((item) => {
            return (
              <li key={[item.persistentId, item.id].join('+')}>
                <ItemPreview item={item} headingLevel={4} />
              </li>
            )
          })}
        </ul>
      </section>
    </li>
  )
}
