import { Fragment } from 'react'

import type { ItemSearchResults } from '@/api/sshoc/types'
import VStack from '@/modules/layout/VStack'

const MAX_METADATA_VALUES = 5

type Items = ItemSearchResults['items']
type Item = Items[number]

/**
 * Item metadata.
 */
export default function ItemMetadata({
  item,
}: {
  item: Item
}): JSX.Element | null {
  const activities = item.properties
    ?.filter((property) => property.type?.code === 'activity')
    ?.slice(0, MAX_METADATA_VALUES)
    ?.map((activity) => activity.concept?.label)
    ?.join(', ')
  const keywords = item.properties
    ?.filter((property) => property.type?.code === 'keyword')
    ?.slice(0, MAX_METADATA_VALUES)
    ?.map((keyword) => keyword.concept?.label)
    ?.join(', ')

  if (
    (activities === undefined || activities.length === 0) &&
    (keywords === undefined || keywords.length === 0)
  ) {
    return null
  }

  return (
    <VStack
      as="dl"
      className="grid text-xs text-gray-500"
      style={{ gridTemplateColumns: 'auto 1fr', columnGap: '0.5rem' }}
    >
      {activities !== undefined && activities.length > 0 ? (
        <Fragment>
          <dt>Activities:</dt>
          <dd>{activities}</dd>
        </Fragment>
      ) : null}
      {keywords !== undefined && keywords.length > 0 ? (
        <Fragment>
          <dt>Keywords:</dt>
          <dd>{keywords}</dd>
        </Fragment>
      ) : null}
    </VStack>
  )
}
