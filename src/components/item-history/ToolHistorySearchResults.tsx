import { ItemHistorySearchResults } from '@/components/item-history/ItemHistorySearchResults'
import type { Tool } from '@/data/sshoc/api/tool-or-service'
import { useToolHistory } from '@/data/sshoc/hooks/tool-or-service'

export interface ToolHistorySearchResultsProps {
  persistentId: Tool['persistentId']
}

export function ToolHistorySearchResults(props: ToolHistorySearchResultsProps): JSX.Element {
  const { persistentId } = props

  const items = useToolHistory({ persistentId })

  return <ItemHistorySearchResults items={items} />
}
