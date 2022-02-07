import dynamic from 'next/dynamic'
import Link from 'next/link'

import type { ItemCategory, ItemSearchResults } from '@/api/sshoc/types'
import ItemMetadata from '@/modules/item/ItemMetadata'
import VStack from '@/modules/layout/VStack'
import { Anchor } from '@/modules/ui/Anchor'
import { ItemCategoryIcon } from '@/modules/ui/ItemCategoryIcon'

/** lazy load markdown processor */
const Plaintext = dynamic(() => {
  return import('@/modules/markdown/Plaintext')
})

const MAX_DESCRIPTION_LENGTH = 280

type Items = ItemSearchResults['items']
type Item = Items[number]

/**
 * Item preview.
 */
export default function ItemCard({ item }: { item: Item }): JSX.Element {
  return (
    <VStack as="article" className="py-6 space-y-4">
      <h4 className="flex items-center space-x-2 text-lg font-medium leading-tight">
        <ItemCategoryIcon
          category={item.category as Exclude<ItemCategory, 'step'>}
          className="flex-shrink-0"
          height="2.5em"
        />
        <Link href={{ pathname: `/${item.category}/${item.persistentId}` }} passHref>
          <a className="transition-colors duration-150 hover:text-primary-800">
            <span>{item.label}</span>
          </a>
        </Link>
      </h4>
      <ItemMetadata item={item} />
      <div className="text-sm leading-7 text-gray-600">
        <Plaintext text={item.description} maxLength={MAX_DESCRIPTION_LENGTH} />
      </div>
      <Link href={{ pathname: `/${item.category}/${item.persistentId}` }} passHref>
        <Anchor className="self-end text-sm">Read more</Anchor>
      </Link>
    </VStack>
  )
}
