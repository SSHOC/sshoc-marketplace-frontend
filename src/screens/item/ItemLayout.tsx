import { Menu } from '@headlessui/react'
import cx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import { Fragment, useState } from 'react'

import type { ActorDto, PropertyDto } from '@/api/sshoc'
import { useGetItemCategories } from '@/api/sshoc'
import { getMediaFileUrl, getMediaThumbnailUrl } from '@/api/sshoc/client'
import type {
  Item as GenericItem,
  ItemCategory as ItemCategoryWithStep,
  ItemSearchQuery,
} from '@/api/sshoc/types'
import DocumentIcon from '@/elements/icons/small/document.svg'
import ProtectedView from '@/modules/auth/ProtectedView'
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
import { Title } from '@/modules/ui/typography/Title'
import styles from '@/screens/item/ItemLayout.module.css'
import { formatDate } from '@/utils/formatDate'
import { getSingularItemCategoryLabel } from '@/utils/getSingularItemCategoryLabel'
import type { RequiredFields } from '@/utils/ts/object'
import { Svg as UrlIcon } from '@@/assets/icons/url.svg'
import OrcidIcon from '@@/public/assets/images/orcid.svg'

/** lazy load markdown processor */
const Markdown = dynamic(() => import('@/modules/markdown/Markdown'))

type ItemCategory = Exclude<ItemCategoryWithStep, 'step'>
type ItemProperties = Exclude<Item['properties'], undefined>
type ItemProperty = ItemProperties[number]
type ItemContributors = Exclude<Item['contributors'], undefined>
type RelatedItems = Exclude<Item['relatedItems'], undefined>
type Item = GenericItem & { dateCreated?: string; dateLastUpdated?: string }

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

  const relatedItems = item.relatedItems as RelatedItems

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
          <HStack className="items-start justify-between space-x-4">
            <div className="flex items-center justify-between space-x-4">
              <ItemThumbnail
                category={item.category as ItemCategory}
                thumbnail={item.thumbnail}
              />
              <Title>{item.label}</Title>
            </div>
            <ProtectedView>
              <div className="flex flex-col space-y-2 xl:flex-row xl:space-y-0 xl:space-x-4">
                {item.status === 'approved' ? (
                  <Link
                    href={{
                      pathname: `/${item.category}/${item.persistentId}/edit`,
                    }}
                  >
                    <a className="w-32 px-6 py-3 text-lg text-center text-white transition rounded lg:text-xl lg:w-48 lg:px-10 lg:py-4 bg-primary-750 hover:bg-secondary-600">
                      Edit
                    </a>
                  </Link>
                ) : null}
                <Link
                  href={{
                    pathname: `/${item.category}/${item.persistentId}/history`,
                  }}
                >
                  <a className="w-32 px-6 py-3 text-lg text-center text-white transition rounded lg:text-xl lg:w-48 lg:px-10 lg:py-4 bg-primary-750 hover:bg-secondary-600">
                    History
                  </a>
                </Link>
              </div>
            </ProtectedView>
          </HStack>
          <ItemDescription description={item.description} />
        </VStack>
        <div className={cx(styles.mainColumn, 'px-6 py-6')}>
          <ItemMedia media={item.media} />
        </div>
        {children}
        <div className={cx(styles.mainColumn, 'px-6 py-6')}>
          <RelatedItems items={relatedItems} />
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
              source={item.source}
              sourceItemId={item.sourceItemId}
              dateCreated={item.dateCreated}
              dateLastUpdated={item.dateLastUpdated}
              externalIds={item.externalIds}
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
  thumbnail,
}: {
  category: ItemCategory
  thumbnail: Item['thumbnail']
}) {
  if (thumbnail != null && thumbnail.mediaId !== undefined) {
    return (
      <img
        src={getMediaThumbnailUrl({ mediaId: thumbnail.mediaId })}
        alt=""
        className="object-contain w-24 h-24"
      />
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
              <span className="px-4 text-left">Go to {label}</span>
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
function ItemMedia({ media }: { media: Item['media'] }) {
  const [index, setIndex] = useState(0)

  if (media === undefined || media.length === 0) return null

  const current = media[index]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const mediaId = current.metadata!.mediaId!
  const currentMediaUrl =
    current.metadata!.location?.sourceUrl ?? getMediaFileUrl({ mediaId })
  const currentMediaCategory = current.metadata!.category

  return (
    <section>
      <SectionTitle className="sr-only">Media</SectionTitle>
      <div className="relative w-full h-64 border border-b-0 border-gray-200">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {currentMediaCategory === 'image' ? (
            <img
              src={currentMediaUrl}
              alt=""
              loading="lazy"
              className="object-contain w-full h-full"
            />
          ) : currentMediaCategory === 'video' ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={currentMediaUrl}
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="grid place-items-center">
              <a href={currentMediaUrl} download rel="noopener noreferrer">
                Download{' '}
                {current.metadata?.filename ??
                  current.metadata?.location?.sourceUrl ??
                  'document'}
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center border border-gray-200">
        <button
          aria-label="Previous image"
          className={cx(
            'inline-flex items-center justify-center px-6',
            media.length === 1
              ? 'text-gray-550 pointer-events-none'
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
          {media.map((m, index) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const mediaId = m.metadata!.mediaId!
            const hasThumbnail = m.metadata!.hasThumbnail
            return (
              <li key={m.metadata?.mediaId}>
                <button onClick={() => setIndex(index)}>
                  {hasThumbnail === true ? (
                    <img
                      src={getMediaThumbnailUrl({ mediaId })}
                      alt=""
                      className="h-24 py-2"
                    />
                  ) : (
                    <div className="grid w-16 h-24 py-2 place-items-center">
                      <img src={DocumentIcon} alt="" className="w-6 h-6" />
                    </div>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          aria-label="Next image"
          className={cx(
            'inline-flex items-center justify-center px-6',
            media.length === 1
              ? 'text-gray-550 pointer-events-none'
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

/**
 * Some properties are marked as `hidden` by the backend.
 * `thumbnail` and `media` are already shown, so we treat these as additional hidden properties
 * in the metadata sidepanel.
 */
const ADDITIONAL_HIDDEN_PROPERTIES = ['thumbnail', 'media']

interface ItemMetadata {
  properties: ItemProperties
  contributors: ItemContributors
  source?: Item['source']
  sourceItemId?: Item['sourceItemId']
  dateCreated?: string
  dateLastUpdated?: string
  externalIds?: Item['externalIds']
}

/**
 * Properties.
 */
function ItemPropertiesList(props: ItemMetadata) {
  const metadata = useItemMetadata(props)

  if (metadata == null) return null

  return (
    <aside className="">
      <h2 className="text-xl font-medium">Details</h2>
      <div className="text-sm divide-y">{Object.values(metadata)}</div>
    </aside>
  )
}

function ItemPropertyValue({ property }: { property: ItemProperty }) {
  switch (property.type?.type) {
    case 'concept':
      return (
        <Anchor href={property.concept?.uri}>{property.concept?.label}</Anchor>
      )
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

function useItemMetadata({
  properties,
  contributors,
  source,
  sourceItemId,
  dateCreated,
  dateLastUpdated,
  externalIds,
}: ItemMetadata) {
  const metadata: any = {}

  if (Array.isArray(properties) && properties.length > 0) {
    const grouped: Record<string, Record<string, Array<PropertyDto>>> = {}
    properties.forEach((property) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const type = property.type!
      if (
        type.hidden === true ||
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ADDITIONAL_HIDDEN_PROPERTIES.includes(type.code!)
      ) {
        return
      }

      const groupName = property.type?.groupName ?? 'Other'
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      grouped[groupName] = grouped[groupName] ?? {}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const label = type.label!
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      grouped[groupName][label] = grouped[groupName][label] ?? []
      grouped[groupName][label].push(property)
    })

    const sorted = Object.entries(grouped)
      .map(([key, values]) => {
        const sortedValues = Object.entries(values).sort(([, [a]], [, [b]]) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          a.type!.ord! > b.type!.ord! ? 1 : -1,
        )
        return [key, sortedValues] as [
          string,
          Array<[string, Array<PropertyDto>]>,
        ]
      })
      .sort(([a], [b]) => (a > b ? 1 : -1))

    metadata.properties =
      sorted.length === 0 ? null : (
        <ul className="py-8 space-y-6" key="item-properties">
          {sorted.map(([groupName, entries]) => {
            return (
              <li key={groupName} className="flex flex-col space-y-2">
                <span className="font-bold tracking-wide text-gray-600 uppercase text-ui-sm whitespace-nowrap">
                  {groupName}
                </span>
                <ul className="flex flex-col space-y-2">
                  {entries.map(([label, properties]) => {
                    return (
                      <li key={label}>
                        <span className="mr-2 font-medium text-gray-550 whitespace-nowrap">
                          {label}:
                        </span>
                        <ul className="inline">
                          {properties.map((property, index) => {
                            return (
                              <li key={property.id} className="inline">
                                {index !== 0 ? ', ' : null}
                                <ItemPropertyValue property={property} />
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      )
  }

  if (Array.isArray(contributors) && contributors.length > 0) {
    const grouped: Record<string, Array<ActorDto>> = {}
    contributors.forEach((contributor) => {
      const role = contributor.role?.label
      if (role != null && contributor.actor != null) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        grouped[role] = grouped[role] ?? []
        grouped[role].push(contributor.actor)
      }
    })

    const sorted = Object.entries(grouped)
      .map(([key, value]) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return [key, value.sort((a, b) => a.name!.localeCompare(b.name!))] as [
          string,
          Array<ActorDto>,
        ]
      })
      .sort(([a], [b]) => (a > b ? 1 : -1))

    metadata.contributors =
      sorted.length === 0 ? null : (
        <ul className="py-8 space-y-6" key="item-actors">
          {sorted.map(([role, actors]) => {
            return (
              <li key={role} className="flex flex-col space-y-3">
                <span className="font-bold tracking-wide text-gray-600 uppercase text-ui-sm whitespace-nowrap">
                  {role}
                </span>
                <ul className="flex flex-col space-y-2">
                  {actors.map((actor) => {
                    const orcid = actor.externalIds?.find(
                      (a) => a.identifierService?.code === 'ORCID',
                    )
                    return (
                      <li key={actor.id} className="flex flex-col">
                        <span className="flex flex-wrap items-center">
                          <span className="mr-1.5">{actor.name}</span>
                          {orcid != null ? (
                            <a
                              href={`https://orcid.org/${orcid.identifier}`}
                              rel="noopener noreferrer"
                              target="_blank"
                              aria-label="ORCID"
                              className="flex-shrink-0 mr-1.5"
                            >
                              <img
                                src={OrcidIcon}
                                alt=""
                                aria-hidden
                                className="w-5 h-5"
                              />
                            </a>
                          ) : null}
                          {Array.isArray(actor.affiliations) &&
                          actor.affiliations.length > 0 ? (
                            <span className="mr-1.5 text-gray-550">
                              {actor.affiliations
                                .map((affiliation) => {
                                  return affiliation.name
                                })
                                .join(', ')}
                            </span>
                          ) : null}
                        </span>
                        {actor.email != null ? (
                          <Anchor href={'mailto:' + actor.email}>
                            {actor.email}
                          </Anchor>
                        ) : null}
                        {actor.website != null ? (
                          <Anchor href={actor.website}>Website</Anchor>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      )
  }

  if (dateCreated != null || dateLastUpdated != null) {
    metadata.dates = (
      <dl className="py-8 space-y-2" key="item-dates">
        {dateCreated != null ? (
          <div className="flex">
            <dt>
              <span className="mr-2 font-medium text-gray-550 whitespace-nowrap">
                Created:
              </span>
            </dt>
            <dd>
              <time dateTime={dateCreated}>{formatDate(dateCreated)}</time>
            </dd>
          </div>
        ) : null}
        {dateLastUpdated != null ? (
          <div className="flex">
            <dt>
              <span className="mr-2 font-medium text-gray-550 whitespace-nowrap">
                Last updated:
              </span>
            </dt>
            <dd>
              <time dateTime={dateLastUpdated}>
                {formatDate(dateLastUpdated)}
              </time>
            </dd>
          </div>
        ) : null}
      </dl>
    )
  }

  if (source != null) {
    const label = source.label

    if (sourceItemId != null) {
      metadata.sourceItemId = (
        <div className="py-8" key="item-source">
          <span className="mr-2 font-medium text-gray-550 whitespace-nowrap">
            Source:
          </span>
          {source.urlTemplate != null ? (
            <Anchor
              href={source.urlTemplate.replace(
                '{source-item-id}',
                sourceItemId,
              )}
            >
              {label}
            </Anchor>
          ) : (
            <span>{label}</span>
          )}
        </div>
      )
    }
  }

  if (Array.isArray(externalIds) && externalIds.length > 0) {
    metadata.externalIds = (
      <ul className="py-8 space-y-6" key="item-externalids">
        {externalIds.map((id) => {
          return (
            <li key={id.identifier} className="flex">
              <span className="mr-2 font-medium text-gray-550 whitespace-nowrap">
                {id.identifierService?.label}:
              </span>
              <span>{id.identifier}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  return metadata
}
