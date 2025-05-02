import { useMemo } from "react";

import type {
	ItemFormBaseFields,
	ItemFormFieldsBase,
} from "@/components/item-form/useItemFormFields";
import { useItemFormFields } from "@/components/item-form/useItemFormFields";

export interface WorkflowStepFormFields extends ItemFormFieldsBase {
	category: "step";
	fields: ItemFormBaseFields;
}

export function useWorkflowStepFormFields(prefix = ""): WorkflowStepFormFields {
	const itemFields = useItemFormFields(prefix);

	const fields = useMemo(() => {
		const fields: WorkflowStepFormFields = {
			category: "step",
			fields: { ...itemFields },
		};

		return fields;
	}, [itemFields]);

	return fields;
}
