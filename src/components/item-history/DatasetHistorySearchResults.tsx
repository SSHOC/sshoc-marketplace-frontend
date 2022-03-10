import { ItemHistorySearchResults } from '@/components/item-history/ItemHistorySearchResults'
import type { Dataset } from '@/data/sshoc/api/dataset'
import { useDatasetHistory } from '@/data/sshoc/hooks/dataset'

export interface DatasetHistorySearchResultsProps {
  persistentId: Dataset['persistentId']
}

export function DatasetHistorySearchResults(props: DatasetHistorySearchResultsProps): JSX.Element {
  const { persistentId } = props

  const items = useDatasetHistory({ persistentId })

  return <ItemHistorySearchResults items={items} />
}
