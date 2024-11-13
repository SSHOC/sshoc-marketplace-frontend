import { ItemContentContributors } from "@/components/item/ItemContentContributors";
import type { Item } from "@/lib/data/sshoc/api/item";
import { useTrainingMaterialVersionInformationContributors } from "@/lib/data/sshoc/hooks/training-material";

export interface TrainingMaterialContentContributorsProps {
  persistentId: Item["persistentId"];
  versionId: Item["id"];
}

export function TrainingMaterialContentContributors(
  props: TrainingMaterialContentContributorsProps
): JSX.Element {
  const { persistentId, versionId } = props;

  const contentContributors = useTrainingMaterialVersionInformationContributors(
    {
      persistentId,
      versionId,
    }
  );

  return (
    <ItemContentContributors contentContributors={contentContributors.data} />
  );
}
