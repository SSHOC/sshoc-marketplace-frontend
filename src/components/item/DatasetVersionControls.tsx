import type { ReactNode } from "react";

import { ItemVersionControls } from "@/components/item/ItemVersionControls";
import type { Dataset } from "@/data/sshoc/api/dataset";
import type { ItemStatus } from "@/data/sshoc/api/item";

export interface DatasetVersionControlsProps {
	persistentId: Dataset["persistentId"];
	status: ItemStatus;
	versionId: Dataset["id"];
}

export function DatasetVersionControls(props: DatasetVersionControlsProps): ReactNode {
	const { persistentId, status, versionId } = props;

	return (
		<ItemVersionControls
			category="dataset"
			persistentId={persistentId}
			status={status}
			versionId={versionId}
		/>
	);
}
