import { Fragment } from 'react'

import { ItemCategoryIcon } from '@/components/common/ItemCategoryIcon'
import { ItemThumbnail } from '@/components/item/ItemThumbnail'
import type { Item } from '@/data/sshoc/api/item'

export interface ItemTitleImageProps {
  category: Item['category']
  thumbnail: Item['thumbnail']
}

export function ItemTitleImage(props: ItemTitleImageProps): JSX.Element {
  const { category, thumbnail } = props

  return (
    <Fragment>
      {thumbnail != null ? (
        <ItemThumbnail thumbnail={thumbnail} />
      ) : (
        <ItemCategoryIcon category={category} />
      )}
    </Fragment>
  )
}
