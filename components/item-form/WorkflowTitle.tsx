import css from "@/components/item-form/WorkflowTitle.module.css";

import type { ReactNode } from "react";

import { useFieldState } from "@/lib/core/form/useFieldState";

export function WorkflowTitle(): ReactNode {
	const title = useFieldState<string>("label").input.value;

	return <h2 className={css["workflow-title"]}>{title}</h2>;
}
