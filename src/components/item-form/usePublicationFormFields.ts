import { useMemo } from "react";

import type { ItemFormDateFields } from "@/components/item-form/useItemFormDateFields";
import { useItemFormDateFields } from "@/components/item-form/useItemFormDateFields";
import type {
	ItemFormBaseFields,
	ItemFormFieldsBase,
} from "@/components/item-form/useItemFormFields";
import { useItemFormFields } from "@/components/item-form/useItemFormFields";

export interface PublicationFormFields extends ItemFormFieldsBase {
	category: "publication";
	fields: ItemFormBaseFields & ItemFormDateFields;
}

export function usePublicationFormFields(prefix = ""): PublicationFormFields {
	const itemFields = useItemFormFields(prefix);
	const dateFields = useItemFormDateFields(prefix);

	const fields = useMemo(() => {
		const fields: PublicationFormFields = {
			category: "publication",
			fields: { ...itemFields, ...dateFields },
		};

		return fields;
	}, [itemFields, dateFields]);

	return fields;
}
