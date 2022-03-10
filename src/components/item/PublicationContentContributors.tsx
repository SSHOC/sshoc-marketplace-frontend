import { ItemContentContributors } from '@/components/item/ItemContentContributors'
import type { Item } from '@/data/sshoc/api/item'
import { usePublicationVersionInformationContributors } from '@/data/sshoc/hooks/publication'

export interface PublicationContentContributorsProps {
  persistentId: Item['persistentId']
  versionId: Item['id']
}

export function PublicationContentContributors(
  props: PublicationContentContributorsProps,
): JSX.Element {
  const { persistentId, versionId } = props

  const contentContributors = usePublicationVersionInformationContributors({
    persistentId,
    versionId,
  })

  return <ItemContentContributors contentContributors={contentContributors.data} />
}
