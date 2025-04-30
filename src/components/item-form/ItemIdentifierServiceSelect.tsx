import type { ReactNode } from "react";

import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useItemSources } from "@/data/sshoc/hooks/item";
import { FormSelect } from "@/lib/core/form/FormSelect";
import { Item } from "@/lib/core/ui/Collection/Item";

export interface ItemIdentifierServiceSelectProps {
	field: ItemFormFields["fields"]["externalIds"]["fields"]["identifierService"];
}

export function ItemIdentifierServiceSelect(props: ItemIdentifierServiceSelectProps): ReactNode {
	const { field } = props;

	const itemSources = useItemSources();
	const items = itemSources.data ?? [];

	return (
		<FormSelect {...field} isLoading={itemSources.isLoading} items={items}>
			{(item) => {
				return <Item key={item.code}>{item.label}</Item>;
			}}
		</FormSelect>
	);
}
