import { ItemVersionControls } from '@/components/item/ItemVersionControls'
import type { Dataset } from '@/data/sshoc/api/dataset'

export interface DatasetVersionControlsProps {
  persistentId: Dataset['persistentId']
  versionId: Dataset['id']
}

export function DatasetVersionControls(props: DatasetVersionControlsProps): JSX.Element {
  const { persistentId, versionId } = props

  return (
    <ItemVersionControls category="dataset" persistentId={persistentId} versionId={versionId} />
  )
}
