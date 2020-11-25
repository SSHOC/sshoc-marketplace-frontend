import cx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import type {
  Item,
  ItemCategory as ItemCategoryWithStep,
} from '@/api/sshoc/types'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import { Anchor } from '@/modules/ui/Anchor'
import { ItemCategoryIcon } from '@/modules/ui/ItemCategoryIcon'
import { SectionTitle } from '@/modules/ui/typography/SectionTitle'

const Plaintext = dynamic(() => import('@/modules/markdown/Plaintext'))

type ItemCategory = Exclude<ItemCategoryWithStep, 'step'>
type RelatedItems = Exclude<Item['relatedItems'], undefined>
type RelatedItem = RelatedItems[number]

const MAX_RELATED_ITEMS_DESCRIPTION = 120

/**
 * Related items.
 */
export default function RelatedItems({
  items,
}: {
  items: RelatedItems
}): JSX.Element | null {
  const relatedItems = items

  const [cursor, setCursor] = useState(4)

  function incrementCursor() {
    setCursor((prev) => prev + 10)
  }

  if (relatedItems === undefined || relatedItems.length === 0) return null
  const isDisabled = cursor >= relatedItems.length

  return (
    <VStack as="section" className="space-y-4">
      <HStack className="space-x-2 items-baseline">
        <SectionTitle>Related</SectionTitle>
        <span className="text-xl text-gray-500">({relatedItems.length})</span>
      </HStack>
      <ul className="grid grid-cols-2 border-t border-b border-gray-200">
        {relatedItems.slice(0, cursor).map((item) => {
          return (
            <li key={item.id} className="border-t border-gray-200 -mt-px">
              <RelatedItem item={item} />
            </li>
          )
        })}
      </ul>
      <div className="self-end py-4">
        <button
          className={cx(
            'px-8 py-3 text-sm rounded transition-colors duration-150',
            isDisabled
              ? 'bg-gray-200 text-gray-500 pointer-events-none'
              : 'bg-primary-800 text-white hover:bg-primary-700',
          )}
          onClick={incrementCursor}
          disabled={isDisabled}
        >
          Show more related items
        </button>
      </div>
    </VStack>
  )
}

function RelatedItem({ item }: { item: RelatedItem }): JSX.Element {
  const pathname = `/${item.category}/${item.id}`
  return (
    <VStack as="article" className="px-4 py-5 space-y-4">
      <h3 className="flex items-center space-x-4 text-lg font-medium leading-5">
        <ItemCategoryIcon
          category={item.category as ItemCategory}
          height="2.5em"
          className="flex-shrink-0"
        />
        <Link href={{ pathname }}>
          <a className="hover:text-primary-700">{item.label}</a>
        </Link>
      </h3>
      <div className="text-sm leading-7">
        <Plaintext
          text={item.description}
          maxLength={MAX_RELATED_ITEMS_DESCRIPTION}
        />
      </div>
      <Link href={{ pathname }} passHref>
        <Anchor className="self-end text-sm" aria-label={item.label}>
          Read more
        </Anchor>
      </Link>
    </VStack>
  )
}
