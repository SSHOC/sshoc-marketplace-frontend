import cx from "clsx";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import css from "@/components/common/ItemCategoryBadge.module.css";
import type { ItemCategoryWithWorkflowStep } from "@/data/sshoc/api/item";

export interface ItemCategoryBadgeProps {
	category: ItemCategoryWithWorkflowStep;
}

export function ItemCategoryBadge(props: ItemCategoryBadgeProps): ReactNode {
	const { category } = props;

	const t = useTranslations();

	const label = t(`common.item-categories.${category}.one`);

	return <span className={cx(css["badge"], css[category])}>{label}</span>;
}
