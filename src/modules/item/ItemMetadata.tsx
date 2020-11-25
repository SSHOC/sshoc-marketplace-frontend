import { Fragment } from 'react'
import type { ItemSearchResults } from '@/api/sshoc/types'
import VStack from '@/modules/layout/VStack'

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
    ?.map((activity) => activity.concept?.label)
    ?.join(', ')
  const keywords = item.properties
    ?.filter((property) => property.type?.code === 'keyword')
    ?.map((keyword) => keyword.value)
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
      className="text-xs text-gray-500 grid"
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
