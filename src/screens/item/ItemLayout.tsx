import { Menu } from '@headlessui/react'
import cx from 'clsx'
import dynamic from 'next/dynamic'
import { Fragment, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { useGetItemCategories } from '@/api/sshoc'
import type {
  ItemCategory as ItemCategoryWithStep,
  ItemSearchQuery,
  Item,
} from '@/api/sshoc/types'
import RelatedItems from '@/modules/item/RelatedItems'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Metadata from '@/modules/metadata/Metadata'
import { Anchor } from '@/modules/ui/Anchor'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { ItemCategoryIcon } from '@/modules/ui/ItemCategoryIcon'
import Triangle from '@/modules/ui/Triangle'
import { SectionTitle } from '@/modules/ui/typography/SectionTitle'
import { SubSectionTitle } from '@/modules/ui/typography/SubSectionTitle'
import { Title } from '@/modules/ui/typography/Title'
import styles from '@/screens/item/ItemLayout.module.css'
import { formatDate } from '@/utils/formatDate'
import { getSingularItemCategoryLabel } from '@/utils/getSingularItemCategoryLabel'
import type { RequiredFields } from '@/utils/ts/object'
import { Svg as UrlIcon } from '@@/assets/icons/url.svg'

/** lazy load markdown processor */
const Markdown = dynamic(() => import('@/modules/markdown/Markdown'))

type ItemCategory = Exclude<ItemCategoryWithStep, 'step'>
type ItemProperties = Exclude<Item['properties'], undefined>
type ItemProperty = ItemProperties[number]
type ItemContributors = Exclude<Item['contributors'], undefined>
type RelatedItems = Exclude<Item['relatedItems'], undefined>

/**
 * Shared item details screen.
 */
export default function ItemLayout({
  item: _item,
  children,
}: PropsWithChildren<{
  item: Item
}>): JSX.Element {
  const { data: itemCategories = {} } = useGetItemCategories()
  /** we can assume these fields to be present */
  const item = _item as RequiredFields<
    typeof _item,
    'id' | 'label' | 'category' | 'accessibleAt'
  >
  const query: ItemSearchQuery = {
    categories: [item.category],
    order: ['label'],
  }

  return (
    <Fragment>
      <Metadata
        title={item.label}
        description={item.description}
        openGraph={{ title: item.label, description: item.description }}
      />
      <GridLayout>
        <Header image={'/assets/images/browse-item/clouds@2x.png'}>
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              {
                pathname: '/search',
                query,
                label: itemCategories[item.category],
              },
              {
                pathname: `/${item.category}/${item.persistentId}`,
                label: item.label,
              },
            ]}
          />
        </Header>
        <VStack className={cx('space-y-12 px-6 py-6', styles.mainColumn)}>
          <HStack className="items-center space-x-4">
            <ItemThumbnail
              category={item.category as ItemCategory}
              properties={item.properties as ItemProperties}
            />
            <Title>{item.label}</Title>
          </HStack>
          <ItemDescription description={item.description} />
        </VStack>
        <div className={cx(styles.mainColumn, 'px-6 py-6')}>
          <ItemMedia properties={item.properties as ItemProperties} />
        </div>
        {children}
        <div className={cx(styles.mainColumn, 'px-6 py-6')}>
          <RelatedItems items={item.relatedItems as RelatedItems} />
        </div>
        <SideColumn>
          <VStack className="px-6 pt-6 pb-12 space-y-16">
            <AccessibleAtLinks
              accessibleAt={item.accessibleAt}
              category={item.category as ItemCategory}
            />
            <ItemPropertiesList
              properties={item.properties as ItemProperties}
              contributors={item.contributors as ItemContributors}
              licenses={item.licenses}
              source={item.source}
              sourceItemId={item.sourceItemId}
            />
          </VStack>
        </SideColumn>
      </GridLayout>
    </Fragment>
  )
}

function SideColumn({ children }: PropsWithChildren<unknown>) {
  return <section className={styles.sideColumn}>{children}</section>
}

/**
 * Thumbail or category icon
 */
function ItemThumbnail({
  category,
  properties,
}: {
  category: ItemCategory
  properties: ItemProperties
}) {
  if (properties === undefined) return null
  const thumbnail = properties.find(
    (property) => property.type?.code === 'thumbnail',
  )
  if (thumbnail !== undefined) {
    return (
      <img src={thumbnail.value} alt="" className="object-contain w-24 h-24" />
    )
  }
  return (
    <ItemCategoryIcon
      category={category}
      width="6em"
      className="flex-shrink-0"
    />
  )
}

/**
 * Description
 */
function ItemDescription({
  description,
}: {
  description: Item['description']
}) {
  if (description === undefined) return null
  return (
    <div className="leading-8">
      <Markdown text={description} />
    </div>
  )
}

/**
 * Upstream link(s) to item.
 */
function AccessibleAtLinks({
  accessibleAt,
  category,
}: {
  accessibleAt: Array<string>
  category: ItemCategory
}) {
  if (accessibleAt === undefined || accessibleAt.length === 0) return null
  /** we only get plural labels from the backend in GET items-categories */
  const label = getSingularItemCategoryLabel(category)
  const buttonClassNames =
    'w-full text-xl rounded py-4 px-4 bg-primary-800 text-white hover:bg-primary-700 transition-colors duration-150 inline-flex items-center'

  /** when more than one upstream link is provided render a menu button */
  if (accessibleAt.length > 1) {
    return (
      <Menu>
        {({ open }) => (
          <div className="relative inline-block w-full">
            <Menu.Button
              className={cx(buttonClassNames, 'inline-flex justify-between')}
            >
              <span className="px-4">Go to {label}</span>
              <span className="pl-3 pr-1 border-l border-primary-500">
                <Triangle />
              </span>
            </Menu.Button>
            <Menu.Items className="absolute z-10 w-full mt-1 overflow-hidden bg-white border rounded shadow-md">
              {accessibleAt.map((href) => (
                <Menu.Item key={href} as={Fragment}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-8 py-6 truncate transition-colors duration-150 text-primary-500 hover:bg-gray-50"
                  >
                    {href}
                  </a>
                </Menu.Item>
              ))}
            </Menu.Items>
          </div>
        )}
      </Menu>
    )
  }

  return (
    <a
      className={buttonClassNames}
      href={accessibleAt[0]}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="inline-flex items-start justify-center w-full px-4 space-x-2">
        <span>Go to {label}</span> <UrlIcon width="0.75em" className="pt-1" />
      </span>
    </a>
  )
}

/**
 * Item media.
 */
function ItemMedia({ properties }: { properties: ItemProperties }) {
  const [index, setIndex] = useState(0)

  const media = properties?.filter(
    (property) => property.type?.code === 'media',
  )

  if (media === undefined || media.length === 0) return null

  const current = media[index]

  return (
    <section>
      <SectionTitle className="sr-only">Media</SectionTitle>
      <div className="relative w-full h-64 border border-b-0 border-gray-200">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <img
            src={current.value}
            alt=""
            loading="lazy"
            className="object-contain w-full h-full"
          />
        </div>
      </div>
      <div className="flex justify-center border border-gray-200">
        <button
          aria-label="Previous image"
          className={cx(
            'inline-flex items-center justify-center px-6',
            media.length === 1
              ? 'text-gray-500 pointer-events-none'
              : 'text-primary-800',
          )}
          disabled={media.length === 1}
          onClick={() => {
            setIndex((index) => (index > 0 ? index - 1 : media.length - 1))
          }}
        >
          <svg
            aria-hidden
            viewBox="0 0 7.599 14.043"
            fill={'currentColor'}
            height="0.8em"
          >
            <g transform="translate(7.599) rotate(90)">
              <path
                className="a"
                d="M14.043,0H0L6.931,7.6Z"
                transform="translate(0 0)"
              />
            </g>
          </svg>
        </button>
        <ul className="flex justify-center flex-1 px-6 space-x-1 border-l border-r border-gray-200">
          {media.map((m) => (
            <li key={m.id}>
              <img src={m.value} alt="" className="h-24 py-2" />
            </li>
          ))}
        </ul>
        <button
          aria-label="Next image"
          className={cx(
            'inline-flex items-center justify-center px-6',
            media.length === 1
              ? 'text-gray-500 pointer-events-none'
              : 'text-primary-800',
          )}
          disabled={media.length === 1}
          onClick={() => {
            setIndex((index) => (index >= media.length - 1 ? 0 : index + 1))
          }}
        >
          <svg
            aria-hidden
            viewBox="0 0 7.599 14.043"
            fill={'currentColor'}
            height="0.8em"
          >
            <g transform="translate(0 14.043) rotate(-90)">
              <path d="M14.043,0H0L6.931,7.6Z" transform="translate(0 0)" />
            </g>
          </svg>
        </button>
      </div>
    </section>
  )
}

/** thumbnail and media are already shown, no need to list them in the metadata panel */
const HIDDEN_PROPERTIES = ['thumbnail', 'media']

/**
 * Properties.
 */
function ItemPropertiesList({
  properties,
  contributors,
  licenses,
  source,
  sourceItemId,
}: {
  properties: ItemProperties
  contributors: ItemContributors
  licenses?: Item['licenses']
  source?: Item['source']
  sourceItemId?: Item['sourceItemId']
}) {
  const groupedProperties = useMemo(() => {
    if (properties === undefined || properties.length === 0) return null

    const grouped: Record<string, Array<ItemProperty>> = {}
    properties.forEach((property) => {
      if (HIDDEN_PROPERTIES.includes(property.type?.code as string)) return

      const label = property.type?.label as string
      if (!Array.isArray(grouped[label])) {
        grouped[label] = []
      }
      grouped[label].push(property)
    })
    return grouped
  }, [properties])

  if (groupedProperties === null) return null

  const sortedLabels = Object.keys(groupedProperties).sort()

  return (
    <VStack className="space-y-4">
      <SubSectionTitle as="h2">Details</SubSectionTitle>
      <VStack as="dl" className="space-y-2 text-sm leading-7">
        {/* contributors are a top-level field, not a property */}
        {contributors != null && contributors.length > 0 ? (
          <div>
            <dt className="inline mr-2 text-gray-500">Contributors:</dt>
            <dd className="inline">
              {contributors.map((contributor, index) => {
                if (contributor == null || contributor.actor == null)
                  return null
                return (
                  <Fragment
                    key={`${contributor.actor.id}${contributor.role?.code}`}
                  >
                    {index !== 0 ? <span>, </span> : null}
                    {contributor.actor?.website != null ? (
                      <a href={contributor.actor.website}>
                        {contributor.actor.name}
                      </a>
                    ) : (
                      contributor.actor.name
                    )}
                  </Fragment>
                )
              })}
            </dd>
          </div>
        ) : null}

        {/* properties */}
        {sortedLabels.map((label) => {
          const properties = groupedProperties[label]
          return (
            <div key={label}>
              <dt className="inline mr-2 text-gray-500">{label}:</dt>
              <dd className="inline">
                {properties.map((property, index) => {
                  return (
                    <Fragment key={property.id}>
                      {index !== 0 ? <span>, </span> : null}
                      <ItemPropertyValue property={property} />
                    </Fragment>
                  )
                })}
              </dd>
            </div>
          )
        })}

        {/* licenses are a top-level field, not a property */}
        {licenses != null && licenses.length > 0 ? (
          <div>
            <dt className="inline mr-2 text-gray-500">Licenses:</dt>
            <dd className="inline">
              {licenses.map((license, index) => {
                return (
                  <Fragment key={license.code}>
                    {index !== 0 ? <span>, </span> : null}
                    {license.accessibleAt != null ? (
                      <a href={license.accessibleAt}>{license.label}</a>
                    ) : (
                      license.label
                    )}
                  </Fragment>
                )
              })}
            </dd>
          </div>
        ) : null}

        {/* source is a top-level field, not a property */}
        {source != null ? (
          <div>
            <dt className="inline mr-2 text-gray-500">Source:</dt>
            <dd className="inline">
              <Fragment key={source.id}>
                {source.urlTemplate != null && sourceItemId != null ? (
                  <a
                    href={source.urlTemplate.replace(
                      '{source-item-id}',
                      sourceItemId,
                    )}
                  >
                    {source.label}
                  </a>
                ) : (
                  source.label
                )}
              </Fragment>
            </dd>
          </div>
        ) : null}
      </VStack>
    </VStack>
  )
}

function ItemPropertyValue({ property }: { property: ItemProperty }) {
  switch (property.type?.type) {
    case 'concept':
      return <a href={property.concept?.uri}>{property.concept?.label}</a>
    case 'string':
      return <span>{property.value}</span>
    case 'url':
      return <Anchor href={property.value}>{property.value}</Anchor>
    case 'int':
    case 'float':
      return <span>{property.value}</span>
    case 'date':
      return property.value === undefined ? null : (
        <time dateTime={property.value}>{formatDate(property.value)}</time>
      )
    default:
      return null
  }
}
