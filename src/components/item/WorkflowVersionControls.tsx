import { ItemVersionControls } from '@/components/item/ItemVersionControls'
import type { Workflow } from '@/data/sshoc/api/workflow'

export interface WorkflowVersionControlsProps {
  persistentId: Workflow['persistentId']
  versionId: Workflow['id']
}

export function WorkflowVersionControls(props: WorkflowVersionControlsProps): JSX.Element {
  const { persistentId, versionId } = props

  return (
    <ItemVersionControls category="workflow" persistentId={persistentId} versionId={versionId} />
  )
}
