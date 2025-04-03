import type { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import dataset from "@/public/assets/images/categories/dataset.svg";
import publication from "@/public/assets/images/categories/publication.svg";
import step from "@/public/assets/images/categories/step.svg";
import toolOrService from "@/public/assets/images/categories/tool-or-service.svg";
import trainingMaterial from "@/public/assets/images/categories/training-material.svg";
import workflow from "@/public/assets/images/categories/workflow.svg";

type ItemCategory =
	| "dataset"
	| "publication"
	| "step"
	| "tool-or-service"
	| "training-material"
	| "workflow";

const categories: Record<ItemCategory, StaticImageData> = {
	dataset,
	publication,
	step,
	"tool-or-service": toolOrService,
	"training-material": trainingMaterial,
	workflow,
};

interface ItemCategoryIconProps {
	category: ItemCategory;
	className?: string;
}

export function ItemCategoryIcon(props: ItemCategoryIconProps): ReactNode {
	const { category, ...rest } = props;

	const t = useTranslations("ItemCategoryIcon");

	const label = t(category);
	const src = categories[category];

	return <img alt="" aria-label={label} title={label} {...rest} data-slot="icon" src={src.src} />;
}
