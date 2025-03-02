import { createUrlSearchParams } from '@stefanprobst/request'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { ItemPreview } from '@/components/common/ItemPreview'
import { SectionTitle } from '@/components/common/SectionTitle'
import css from '@/components/home/RecommendedItems.module.css'
import { SubSectionHeader } from '@/components/home/SubSectionHeader'
import { SubSectionHeaderLink } from '@/components/home/SubSectionHeaderLink'
import { SubSectionTitle } from '@/components/home/SubSectionTitle'
import type { ItemCategory } from '@/data/sshoc/api/item'
import { useItemCategories, useItemSearch } from '@/data/sshoc/hooks/item'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'
import { keys } from '@/lib/utils'
import { maxRecommendedItemsPerCategory } from '~/config/sshoc.config'

export function RecommendedItems(): JSX.Element {
  const t = useTranslations('common')
  const itemCategories = useItemCategories()

  if (itemCategories.data == null) {
    return (
      <section className={css['container']}>
        <Centered>
          <LoadingIndicator />
        </Centered>
      </section>
    )
  }

  return (
    <section className={css['container']}>
      <SectionTitle>{t('home.recommended')}</SectionTitle>
      <ul role="list" className={css['sections']}>
        {keys(itemCategories.data).map((category) => {
          if (category === 'step') return null

          return <RecommendedItemsForCategory key={category} category={category} />
        })}
      </ul>
    </section>
  )
}

interface RecommendedItemsForCategoryProps {
  category: ItemCategory
}

function RecommendedItemsForCategory(props: RecommendedItemsForCategoryProps): JSX.Element {
  const { category } = props

  const t = useTranslations('common')
  const itemSearch = useItemSearch({
    categories: [category],
    'f.keyword': ['recommended'],
    order: ['modified-on'],
    perpage: maxRecommendedItemsPerCategory,
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
        <SubSectionHeader>
          <SubSectionTitle>{t(`item-categories.${category}.other`)}</SubSectionTitle>
          <SubSectionHeaderLink
            href={`/search?${createUrlSearchParams({ categories: [category], order: ['label'] })}`}
          >
            {t('see-all')}
          </SubSectionHeaderLink>
        </SubSectionHeader>
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
