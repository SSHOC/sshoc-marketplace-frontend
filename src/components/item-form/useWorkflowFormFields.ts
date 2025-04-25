import { useMemo } from "react";

import type {
	ItemFormBaseFields,
	ItemFormFieldsBase,
} from "@/components/item-form/useItemFormFields";
import { useItemFormFields } from "@/components/item-form/useItemFormFields";

export interface WorkflowFormFields extends ItemFormFieldsBase {
	category: "workflow";
	fields: ItemFormBaseFields;
}

export function useWorkflowFormFields(prefix = ""): WorkflowFormFields {
	const itemFields = useItemFormFields(prefix);

	const fields = useMemo(() => {
		const fields: WorkflowFormFields = {
			category: "workflow",
			fields: { ...itemFields },
		};

		return fields;
	}, [itemFields]);

	return fields;
}
