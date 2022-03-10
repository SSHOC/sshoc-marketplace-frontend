import { ItemHistorySearchResults } from '@/components/item-history/ItemHistorySearchResults'
import type { Publication } from '@/data/sshoc/api/publication'
import { usePublicationHistory } from '@/data/sshoc/hooks/publication'

export interface PublicationHistorySearchResultsProps {
  persistentId: Publication['persistentId']
}

export function PublicationHistorySearchResults(
  props: PublicationHistorySearchResultsProps,
): JSX.Element {
  const { persistentId } = props

  const items = usePublicationHistory({ persistentId })

  return <ItemHistorySearchResults items={items} />
}
