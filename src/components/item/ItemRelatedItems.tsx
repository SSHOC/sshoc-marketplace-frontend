import { useTranslations } from 'next-intl'
import { Fragment, useState } from 'react'

import { ItemPreview } from '@/components/common/ItemPreview'
import { ItemsCount } from '@/components/common/ItemsCount'
import { SectionHeader } from '@/components/common/SectionHeader'
import { SectionTitle } from '@/components/common/SectionTitle'
import css from '@/components/item/ItemRelatedItems.module.css'
import type { Item } from '@/data/sshoc/api/item'
import { Button } from '@/lib/core/ui/Button/Button'
import { initialRelatedItemsCount, relatedItemsPage } from '~/config/sshoc.config'

export interface ItemRelatedItemsProps {
  items: Item['relatedItems']
  /** @default 2 */
  headingLevel?: 2 | 3 | 4
}

export function ItemRelatedItems(props: ItemRelatedItemsProps): JSX.Element {
  const { items, headingLevel = 2 } = props

  const t = useTranslations('common')
  const [relatedItemsCount, setRelatedItemsCount] = useState(initialRelatedItemsCount)

  if (items.length === 0) {
    return <Fragment />
  }

  const visibleItems = items.slice(0, relatedItemsCount)
  const hasMoreItems = visibleItems.length < items.length

  function showMore() {
    if (hasMoreItems) {
      setRelatedItemsCount((relatedItemsCount) => {
        return relatedItemsCount + relatedItemsPage
      })
    }
  }

  const nextLevel = (headingLevel + 1) as 3 | 4 | 5

  return (
    <section className={css['container']}>
      <SectionHeader>
        <SectionTitle headingLevel={headingLevel}>
          {t('item.related-items.other')}
          <ItemsCount count={items.length} />
        </SectionTitle>
      </SectionHeader>
      <ul role="list" className={css['items']}>
        {visibleItems.map((item) => {
          return (
            <li key={item.persistentId}>
              <ItemPreview item={item} headingLevel={nextLevel} />
            </li>
          )
        })}
      </ul>
      <div className={css['controls']}>
        <Button
          aria-label={t('item.show-more-related-items')}
          isDisabled={!hasMoreItems}
          onPress={showMore}
        >
          {t('item.show-more')}
        </Button>
      </div>
    </section>
  )
}
