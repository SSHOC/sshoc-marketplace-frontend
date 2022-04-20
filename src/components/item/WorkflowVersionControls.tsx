import { ItemVersionControls } from '@/components/item/ItemVersionControls'
import type { ItemStatus } from '@/data/sshoc/api/item'
import type { Workflow } from '@/data/sshoc/api/workflow'

export interface WorkflowVersionControlsProps {
  persistentId: Workflow['persistentId']
  status: ItemStatus
  versionId: Workflow['id']
}

export function WorkflowVersionControls(props: WorkflowVersionControlsProps): JSX.Element {
  const { persistentId, status, versionId } = props

  return (
    <ItemVersionControls
      category="workflow"
      persistentId={persistentId}
      status={status}
      versionId={versionId}
    />
  )
}
