import { ItemHistorySearchResults } from '@/components/item-history/ItemHistorySearchResults'
import type { Workflow } from '@/data/sshoc/api/workflow'
import { useWorkflowHistory } from '@/data/sshoc/hooks/workflow'

export interface WorkflowHistorySearchResultsProps {
  persistentId: Workflow['persistentId']
}

export function WorkflowHistorySearchResults(
  props: WorkflowHistorySearchResultsProps,
): JSX.Element {
  const { persistentId } = props

  const items = useWorkflowHistory({ persistentId })

  return <ItemHistorySearchResults items={items} />
}
