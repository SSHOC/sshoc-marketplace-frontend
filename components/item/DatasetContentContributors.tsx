import type { ReactNode } from "react";

import { ItemContentContributors } from "@/components/item/ItemContentContributors";
import type { Item } from "@/data/sshoc/api/item";
import { useDatasetVersionInformationContributors } from "@/data/sshoc/hooks/dataset";

export interface DatasetContentContributorsProps {
	persistentId: Item["persistentId"];
	versionId: Item["id"];
}

export function DatasetContentContributors(props: DatasetContentContributorsProps): ReactNode {
	const { persistentId, versionId } = props;

	const contentContributors = useDatasetVersionInformationContributors({
		persistentId,
		versionId,
	});

	return <ItemContentContributors contentContributors={contentContributors.data} />;
}
