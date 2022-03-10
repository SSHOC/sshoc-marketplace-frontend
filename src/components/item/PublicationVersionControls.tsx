import { ItemVersionControls } from '@/components/item/ItemVersionControls'
import type { Publication } from '@/data/sshoc/api/publication'

export interface PublicationVersionControlsProps {
  persistentId: Publication['persistentId']
  versionId: Publication['id']
}

export function PublicationVersionControls(props: PublicationVersionControlsProps): JSX.Element {
  const { persistentId, versionId } = props

  return (
    <ItemVersionControls category="publication" persistentId={persistentId} versionId={versionId} />
  )
}
