import cx from 'clsx'
import Image from 'next/image'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'
import { useSearchItems } from '@/api/sshoc'
import type { ItemSearchQuery, ItemSearchResults } from '@/api/sshoc/types'
import ItemCard from '@/modules/item/ItemCard'
import FullWidth from '@/modules/layout/FullWidth'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Mdx from '@/modules/markdown/Mdx'
import Metadata from '@/modules/metadata/Metadata'
import ItemSearchForm, {
  ItemAutoCompleteInput,
  ItemCategoriesSelect,
  SubmitButton,
} from '@/modules/search/ItemSearchForm'
import { Anchor } from '@/modules/ui/Anchor'
import { SectionTitle } from '@/modules/ui/typography/SectionTitle'
import { SubSectionTitle } from '@/modules/ui/typography/SubSectionTitle'
import { Title } from '@/modules/ui/typography/Title'
import styles from '@/screens/home/HomeScreen.module.css'
import { Svg as PeopleImage } from '@@/assets/images/home/people.svg'
import Content, { metadata } from '@@/content/pages/home.mdx'

type ContentMetadata = {
  title: string
}

const meta = metadata as ContentMetadata

const MAX_BROWSE_ITEMS = 20
const MAX_LAST_ADDED_ITEMS = 5

type Facets = ItemSearchResults['facets']
type Items = ItemSearchResults['items']

/**
 * Home screen.
 */
export default function HomeScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata title="Home" />
      <GridLayout>
        <Hero />
        <SearchResultsView />
      </GridLayout>
    </Fragment>
  )
}

/**
 * Hero section.
 */
function Hero() {
  return (
    <FullWidth>
      <Image
        src="/assets/images/home/clouds@2x.png"
        alt=""
        layout="fill"
        loading="lazy"
        // objectFit="cover"
        quality={100}
        // applies to the <img>, not the <div> container, so we still need
        // to add position: relative to content that should be layered above
        className="-z-10 object-cover"
      />
      <div className="mx-auto max-w-screen-lg mt-24 space-y-6 p-6 relative text-sm">
        <Title>{meta.title}</Title>
        <Mdx>
          <Content />
        </Mdx>
        <ItemSearchForm className="px-8 py-3 space-x-2 text-base rounded-md shadow-md">
          <ItemCategoriesSelect />
          <ItemAutoCompleteInput />
          <SubmitButton className="h-12" />
        </ItemSearchForm>
      </div>
      <PeopleImage className="mx-auto max-w-screen-xl -mt-12 mb-6" />
    </FullWidth>
  )
}

/**
 * Browse facet values and last added items.
 */
function SearchResultsView() {
  const { data: searchResults } = useSearchItems({ order: ['modified-on'] })
  return (
    <Fragment>
      <MainColumn>
        <Browse facets={searchResults?.facets} />
      </MainColumn>
      <SideColumn>
        <LastAdded items={searchResults?.items} />
      </SideColumn>
    </Fragment>
  )
}

/**
 * Browse activities and keywords.
 */
function Browse({ facets }: { facets?: Facets }) {
  if (facets === undefined) return null
  return (
    <VStack className="space-y-6">
      <SectionTitle>Browse</SectionTitle>
      <SubSection
        title="Browse by activity"
        href={{ pathname: '/browse/activity' }}
      >
        <ul className="flex flex-wrap">
          {Object.entries(facets.activity)
            .slice(0, MAX_BROWSE_ITEMS)
            .map(([activity, { count }]) => {
              const query: ItemSearchQuery = { 'f.activity': [activity] }
              return (
                <li key={activity} className="mb-4 mr-4">
                  <Link href={{ pathname: '/search', query }} passHref>
                    <Anchor>
                      {activity}{' '}
                      <span className="text-gray-500">({count})</span>
                    </Anchor>
                  </Link>
                </li>
              )
            })}
        </ul>
      </SubSection>
      <SubSection
        title="Browse by keyword"
        href={{ pathname: '/browse/keyword' }}
      >
        <ul className="flex flex-wrap">
          {Object.entries(facets.keyword)
            .slice(0, MAX_BROWSE_ITEMS)
            .map(([keyword, { count }]) => {
              const query: ItemSearchQuery = { 'f.keyword': [keyword] }
              return (
                <li key={keyword} className="mb-4 mr-4">
                  <Link href={{ pathname: '/search', query }} passHref>
                    <Anchor>
                      {keyword} <span className="text-gray-500">({count})</span>
                    </Anchor>
                  </Link>
                </li>
              )
            })}
        </ul>
      </SubSection>
    </VStack>
  )
}

/**
 * Browse last added items.
 */
function LastAdded({ items }: { items?: Items }) {
  if (items === undefined) return null
  const query: ItemSearchQuery = { order: ['modified-on'] }

  return (
    <VStack className="space-y-6">
      <SectionTitle>Last added</SectionTitle>
      <SubSection title="See what's new" href={{ pathname: '/search', query }}>
        <VStack as="ul" className="divide-y divide-gray-200">
          {items.slice(0, MAX_LAST_ADDED_ITEMS).map((item) => {
            return (
              <li key={item.id}>
                <ItemCard item={item} />
              </li>
            )
          })}
        </VStack>
      </SubSection>
    </VStack>
  )
}

/**
 * Main column layout.
 */
function MainColumn({ children }: PropsWithChildren<unknown>) {
  const classNames = {
    section: cx('px-6 py-12', styles.mainColumn),
    bleed: cx(styles.leftBleed),
  }

  return (
    <Fragment>
      <b className={classNames.bleed} />
      <section className={classNames.section}>{children}</section>
    </Fragment>
  )
}

/**
 * Side column layout.
 */
function SideColumn({ children }: PropsWithChildren<unknown>) {
  const classNames = {
    section: cx('bg-gray-50 px-6 py-12', styles.sideColumn),
    bleed: cx('bg-gray-50', styles.rightBleed),
  }

  return (
    <Fragment>
      <section className={classNames.section}>{children}</section>
      <b className={classNames.bleed} />
    </Fragment>
  )
}

/**
 * Subsection.
 */
function SubSection({
  title,
  href,
  children,
}: PropsWithChildren<{ title: string; href: LinkProps['href'] }>) {
  return (
    <Fragment>
      <HStack className="justify-between items-baseline border-b border-gray-200 py-4">
        <SubSectionTitle>{title}</SubSectionTitle>
        <Link href={href} passHref>
          <Anchor>See all</Anchor>
        </Link>
      </HStack>
      {children}
    </Fragment>
  )
}
