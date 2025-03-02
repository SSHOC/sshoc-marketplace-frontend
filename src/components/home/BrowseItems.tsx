import { createUrlSearchParams } from '@stefanprobst/request'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { Link } from '@/components/common/Link'
import { SectionTitle } from '@/components/common/SectionTitle'
import css from '@/components/home/BrowseItems.module.css'
import { SubSectionHeader } from '@/components/home/SubSectionHeader'
import { SubSectionHeaderLink } from '@/components/home/SubSectionHeaderLink'
import { SubSectionTitle } from '@/components/home/SubSectionTitle'
import type { ItemFacet, ItemSearch } from '@/data/sshoc/api/item'
import { useItemSearch } from '@/data/sshoc/hooks/item'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'
import { length } from '@/lib/utils'
import { maxBrowseFacets, maxLastAddedItems } from '~/config/sshoc.config'

export function BrowseItems(): JSX.Element {
  const t = useTranslations('common')
  /** Match the request from `LastUpdatedItems` so it can be deduplicated. Here we only need the list of facet values. */
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

  const { activity, keyword } = itemSearch.data.facets

  return (
    <section className={css['container']}>
      <SectionTitle>{t('home.browse')}</SectionTitle>
      <BrowseLinks
        title={t('home.browse-by-facet', {
          facet: t('facets.activity.one'),
        })}
        values={activity}
        facet="activity"
      />
      <BrowseLinks
        title={t('home.browse-by-facet', {
          facet: t('facets.keyword.one'),
        })}
        values={keyword}
        facet="keyword"
      />
    </section>
  )
}

interface BrowseLinksProps {
  title: string
  values: ItemSearch.Response['facets'][ItemFacet]
  facet: ItemFacet
}

function BrowseLinks(props: BrowseLinksProps): JSX.Element {
  const { title, values, facet } = props

  const t = useTranslations('common')

  if (length(values) === 0) {
    return <Fragment />
  }

  return (
    <section className={css['section']}>
      <SubSectionHeader>
        <SubSectionTitle>{title}</SubSectionTitle>
        <SubSectionHeaderLink
          aria-label={t('see-all-facets', {
            facet: t(`facets.${facet}.other`),
          })}
          href={`/browse/${facet}`}
        >
          {t('see-all')}
        </SubSectionHeaderLink>
      </SubSectionHeader>
      <ul role="list" className={css['items']}>
        {Object.entries(values)
          .slice(0, maxBrowseFacets)
          .map(([value, { count }]) => {
            const query = { [`f.${facet}`]: [value] } as {
              [K in ItemFacet as `f.${K}`]: Array<string>
            }

            if (count === 0) return null

            return (
              <li key={value}>
                <Link href={`/search?${createUrlSearchParams(query)}`} variant="tag">
                  <span>{value}</span>
                  <span className={css['item-count']}>({count})</span>
                </Link>
              </li>
            )
          })}
      </ul>
    </section>
  )
}
