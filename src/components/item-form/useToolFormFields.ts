import { useMemo } from "react";

import type {
	ItemFormBaseFields,
	ItemFormFieldsBase,
} from "@/components/item-form/useItemFormFields";
import { useItemFormFields } from "@/components/item-form/useItemFormFields";

export interface ToolFormFields extends ItemFormFieldsBase {
	category: "tool-or-service";
	fields: ItemFormBaseFields;
}

export function useToolFormFields(prefix = ""): ToolFormFields {
	const itemFields = useItemFormFields(prefix);

	const fields = useMemo(() => {
		const fields: ToolFormFields = {
			category: "tool-or-service",
			fields: { ...itemFields },
		};

		return fields;
	}, [itemFields]);

	return fields;
}
