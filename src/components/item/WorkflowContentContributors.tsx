import type { ReactNode } from "react";

import { ItemContentContributors } from "@/components/item/ItemContentContributors";
import type { Item } from "@/data/sshoc/api/item";
import { useWorkflowVersionInformationContributors } from "@/data/sshoc/hooks/workflow";

export interface WorkflowContentContributorsProps {
	persistentId: Item["persistentId"];
	versionId: Item["id"];
}

export function WorkflowContentContributors(props: WorkflowContentContributorsProps): ReactNode {
	const { persistentId, versionId } = props;

	const contentContributors = useWorkflowVersionInformationContributors({
		persistentId,
		versionId,
	});

	return <ItemContentContributors contentContributors={contentContributors.data} />;
}
