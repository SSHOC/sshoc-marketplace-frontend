import type { ReactNode } from "react";

import type { ItemCategoryWithWorkflowStep } from "@/data/sshoc/api/item";
import DatasetIcon from "@/lib/core/ui/icons/category-dataset";
import PublicationIcon from "@/lib/core/ui/icons/category-publication";
import WorkflowStepIcon from "@/lib/core/ui/icons/category-step";
import ToolIcon from "@/lib/core/ui/icons/category-tool-or-service";
import TrainingMaterialIcon from "@/lib/core/ui/icons/category-training-material";
import WorkflowIcon from "@/lib/core/ui/icons/category-workflow";

export interface ItemCategoryIconProps {
	category: ItemCategoryWithWorkflowStep;
}

export function ItemCategoryIcon(props: ItemCategoryIconProps): ReactNode {
	switch (props.category) {
		case "dataset":
			return <DatasetIcon aria-hidden={true} width={40} height={40} />;
		case "publication":
			return <PublicationIcon aria-hidden={true} width={40} height={40} />;
		case "tool-or-service":
			return <ToolIcon aria-hidden={true} width={40} height={40} />;
		case "training-material":
			return <TrainingMaterialIcon aria-hidden={true} width={40} height={40} />;
		case "workflow":
			return <WorkflowIcon aria-hidden={true} width={40} height={40} />;
		case "step":
			return <WorkflowStepIcon aria-hidden={true} width={40} height={40} />;
	}
}
