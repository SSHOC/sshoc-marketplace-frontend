import type { ReactNode } from "react";

import { ItemControls } from "@/components/item/ItemControls";
import type { Workflow } from "@/data/sshoc/api/workflow";

export interface WorkflowControlsProps {
	persistentId: Workflow["persistentId"];
}

export function WorkflowControls(props: WorkflowControlsProps): ReactNode {
	const { persistentId } = props;

	return <ItemControls category="workflow" persistentId={persistentId} />;
}
