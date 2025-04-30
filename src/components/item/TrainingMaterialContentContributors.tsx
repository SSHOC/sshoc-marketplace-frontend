import type { ReactNode } from "react";

import { ItemContentContributors } from "@/components/item/ItemContentContributors";
import type { Item } from "@/data/sshoc/api/item";
import { useTrainingMaterialVersionInformationContributors } from "@/data/sshoc/hooks/training-material";

export interface TrainingMaterialContentContributorsProps {
	persistentId: Item["persistentId"];
	versionId: Item["id"];
}

export function TrainingMaterialContentContributors(
	props: TrainingMaterialContentContributorsProps,
): ReactNode {
	const { persistentId, versionId } = props;

	const contentContributors = useTrainingMaterialVersionInformationContributors({
		persistentId,
		versionId,
	});

	return <ItemContentContributors contentContributors={contentContributors.data} />;
}
