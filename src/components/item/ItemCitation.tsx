import styles from '@/components/item/ItemCitation.module.css'
import type { Item } from '@/data/sshoc/api/item'
import { itemRoutes as routes } from '@/lib/core/navigation/item-routes'
import { createSiteUrl, isNonEmptyString } from '@/lib/utils'

export interface ItemCitationProps {
  item: Item
}

export function ItemCitation(props: ItemCitationProps): JSX.Element {
  const { item } = props

  const citation = useCitation(item)

  return (
    <small className={styles['container']}>
      <span>Cite as: </span>
      <span>{citation}</span>
    </small>
  )
}

function useCitation(item: Item): string {
  const title = item.label
  const version = item.version
  const url = createSiteUrl(routes.ItemPage(item.category)({ persistentId: item.persistentId }))
  const year = new Date(item.lastInfoUpdate).getUTCFullYear()
  const authors = item.contributors
    .filter((contributor) => {
      return contributor.role.code === 'author'
    })
    .map((contributor) => {
      return contributor.actor.name
    })

  let citation = ''

  if (authors.length > 0) {
    citation += `${authors.join(', ')} (${year}): `
  }

  citation += title

  if (!/[!?]$/.test(title)) {
    citation += '. '
  } else {
    citation += ' '
  }

  if (isNonEmptyString(version)) {
    citation += `Version ${item.version} `
  }

  citation += `Retrieved ${Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
    new Date(),
  )} from ${url}`

  return citation
}
