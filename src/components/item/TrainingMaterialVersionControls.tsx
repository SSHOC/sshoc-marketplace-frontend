import { ItemVersionControls } from '@/components/item/ItemVersionControls'
import type { TrainingMaterial } from '@/data/sshoc/api/training-material'

export interface TrainingMaterialVersionControlsProps {
  persistentId: TrainingMaterial['persistentId']
  versionId: TrainingMaterial['id']
}

export function TrainingMaterialVersionControls(
  props: TrainingMaterialVersionControlsProps,
): JSX.Element {
  const { persistentId, versionId } = props

  return (
    <ItemVersionControls
      category="training-material"
      persistentId={persistentId}
      versionId={versionId}
    />
  )
}
