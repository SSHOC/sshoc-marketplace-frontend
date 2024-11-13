import { ItemContentContributors } from "@/components/item/ItemContentContributors";
import type { Item } from "@/lib/data/sshoc/api/item";
import { useToolVersionInformationContributors } from "@/lib/data/sshoc/hooks/tool-or-service";

export interface ToolOrServiceContentContributorsProps {
  persistentId: Item["persistentId"];
  versionId: Item["id"];
}

export function ToolOrServiceContentContributors(
  props: ToolOrServiceContentContributorsProps
): JSX.Element {
  const { persistentId, versionId } = props;

  const contentContributors = useToolVersionInformationContributors({
    persistentId,
    versionId,
  });

  return (
    <ItemContentContributors contentContributors={contentContributors.data} />
  );
}
