import { ItemVersionControls } from '@/components/item/ItemVersionControls'
import type { Tool } from '@/data/sshoc/api/tool-or-service'

export interface ToolOrServiceVersionControlsProps {
  persistentId: Tool['persistentId']
  versionId: Tool['id']
}

export function ToolOrServiceVersionControls(
  props: ToolOrServiceVersionControlsProps,
): JSX.Element {
  const { persistentId, versionId } = props

  return (
    <ItemVersionControls
      category="tool-or-service"
      persistentId={persistentId}
      versionId={versionId}
    />
  )
}
