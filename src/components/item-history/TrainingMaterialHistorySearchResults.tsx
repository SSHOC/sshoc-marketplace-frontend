import { ItemHistorySearchResults } from '@/components/item-history/ItemHistorySearchResults'
import type { TrainingMaterial } from '@/data/sshoc/api/training-material'
import { useTrainingMaterialHistory } from '@/data/sshoc/hooks/training-material'

export interface TrainingMaterialHistorySearchResultsProps {
  persistentId: TrainingMaterial['persistentId']
}

export function TrainingMaterialHistorySearchResults(
  props: TrainingMaterialHistorySearchResultsProps,
): JSX.Element {
  const { persistentId } = props

  const items = useTrainingMaterialHistory({ persistentId })

  return <ItemHistorySearchResults items={items} />
}
