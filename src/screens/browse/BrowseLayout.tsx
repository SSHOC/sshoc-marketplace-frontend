import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'

import { useSearchItems } from '@/api/sshoc'
import type { ItemSearchQuery } from '@/api/sshoc/types'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Anchor } from '@/modules/ui/Anchor'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { Title } from '@/modules/ui/typography/Title'
import { groupAlphabetically } from '@/utils/groupAlphabetically'

type BrowseFacet = 'activity' | 'keyword'

/**
 * Browse activities screen.
 */
export default function BrowseActivitiesScreen({
  breadcrumb,
  facet,
  title,
}: PropsWithChildren<{
  breadcrumb: { pathname: string; label: string }
  facet: BrowseFacet
  title: string
}>): JSX.Element {
  return (
    <Fragment>
      <Metadata title={title} />
      <GridLayout>
        <Header image="/assets/images/browse-item/clouds@2x.png">
          <Breadcrumbs links={[{ pathname: '/', label: 'Home' }, breadcrumb]} />
        </Header>
        <ContentColumn>
          <div className="px-6 pb-12">
            <Title>{title}</Title>
            <Browse facet={facet} />
          </div>
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}

function Browse({ facet }: { facet: BrowseFacet }) {
  /**
   * same query as on the home page, so this should already be cached.
   * if most users come to browse pages from the search page, consider
   * switching to an empty query, which equals the initial search page query.
   */
  const order = 'modified-on'
  const { data: results } = useSearchItems({ order: [order] })

  if (results === undefined || results.facets === undefined) return null
  const grouped = groupAlphabetically(results.facets[facet])

  return (
    <ul className="py-12 space-y-8 gap-x-12" style={{ columnCount: 3 }}>
      {Object.keys(grouped)
        .sort()
        .map((char) => {
          const values = grouped[char]
          return (
            <li key={char}>
              <BrowseGroup char={char} facet={facet} values={values} />
            </li>
          )
        })}
    </ul>
  )
}

function BrowseGroup({
  char,
  facet,
  values,
}: {
  char: string
  facet: 'activity' | 'keyword'
  values: Record<string, { count?: number }>
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between space-x-4">
        <h2
          className="text-2xl font-medium uppercase text-gray-250"
          aria-label={`Values starting with character ${char}`}
        >
          {char}
        </h2>
        <div className="flex-1 border-b border-gray-250" />
      </div>
      <ul className="space-y-1">
        {Object.entries(values).map(([value, { count }]) => {
          const query: ItemSearchQuery = { [`f.${facet}`]: [value] }
          return (
            <li key={value}>
              <Link href={{ pathname: '/search', query }} passHref>
                <Anchor>
                  {value} <span className="text-gray-500">({count})</span>
                </Anchor>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
