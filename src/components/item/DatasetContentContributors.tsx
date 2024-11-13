import { ItemContentContributors } from "@/components/item/ItemContentContributors";
import type { Item } from "@/lib/data/sshoc/api/item";
import { useDatasetVersionInformationContributors } from "@/lib/data/sshoc/hooks/dataset";

export interface DatasetContentContributorsProps {
  persistentId: Item["persistentId"];
  versionId: Item["id"];
}

export function DatasetContentContributors(
  props: DatasetContentContributorsProps
): JSX.Element {
  const { persistentId, versionId } = props;

  const contentContributors = useDatasetVersionInformationContributors({
    persistentId,
    versionId,
  });

  return (
    <ItemContentContributors contentContributors={contentContributors.data} />
  );
}
