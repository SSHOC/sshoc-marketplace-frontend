import { ItemContentContributors } from "@/components/item/ItemContentContributors";
import type { Item } from "@/lib/data/sshoc/api/item";
import { useWorkflowVersionInformationContributors } from "@/lib/data/sshoc/hooks/workflow";

export interface WorkflowContentContributorsProps {
  persistentId: Item["persistentId"];
  versionId: Item["id"];
}

export function WorkflowContentContributors(
  props: WorkflowContentContributorsProps
): JSX.Element {
  const { persistentId, versionId } = props;

  const contentContributors = useWorkflowVersionInformationContributors({
    persistentId,
    versionId,
  });

  return (
    <ItemContentContributors contentContributors={contentContributors.data} />
  );
}
