import type { ReactNode } from "react";

import type { ItemCategoryWithWorkflowStep } from "@/data/sshoc/api/item";
import { useI18n } from "@/lib/core/i18n/useI18n";
import DatasetIcon from "~/public/assets/images/categories/dataset.svg?symbol-icon";
import PublicationIcon from "~/public/assets/images/categories/publication.svg?symbol-icon";
import WorkflowStepIcon from "~/public/assets/images/categories/step.svg?symbol-icon";
import ToolIcon from "~/public/assets/images/categories/tool-or-service.svg?symbol-icon";
import TrainingMaterialIcon from "~/public/assets/images/categories/training-material.svg?symbol-icon";
import WorkflowIcon from "~/public/assets/images/categories/workflow.svg?symbol-icon";

export interface ItemCategoryIconProps {
	category: ItemCategoryWithWorkflowStep;
}

export function ItemCategoryIcon(props: ItemCategoryIconProps): ReactNode {
	const { t } = useI18n<"common">();

	const label = t(["common", "item-categories", props.category, "one"]);

	switch (props.category) {
		case "dataset":
			return <DatasetIcon width={40} height={40} aria-label={label} title={label} />;
		case "publication":
			return <PublicationIcon width={40} height={40} aria-label={label} title={label} />;
		case "tool-or-service":
			return <ToolIcon width={40} height={40} aria-label={label} title={label} />;
		case "training-material":
			return <TrainingMaterialIcon width={40} height={40} aria-label={label} title={label} />;
		case "workflow":
			return <WorkflowIcon width={40} height={40} aria-label={label} title={label} />;
		case "step":
			return <WorkflowStepIcon width={40} height={40} aria-label={label} title={label} />;
	}
}
