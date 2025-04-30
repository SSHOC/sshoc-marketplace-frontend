import type { ReactNode } from "react";

import { ItemVersionControls } from "@/components/item/ItemVersionControls";
import type { ItemStatus } from "@/data/sshoc/api/item";
import type { TrainingMaterial } from "@/data/sshoc/api/training-material";

export interface TrainingMaterialVersionControlsProps {
	persistentId: TrainingMaterial["persistentId"];
	status: ItemStatus;
	versionId: TrainingMaterial["id"];
}

export function TrainingMaterialVersionControls(
	props: TrainingMaterialVersionControlsProps,
): ReactNode {
	const { persistentId, status, versionId } = props;

	return (
		<ItemVersionControls
			category="training-material"
			persistentId={persistentId}
			status={status}
			versionId={versionId}
		/>
	);
}
