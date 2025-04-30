import type { ReactNode } from "react";

import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useItemRelations } from "@/data/sshoc/hooks/item";
import { FormSelect } from "@/lib/core/form/FormSelect";
import { Item } from "@/lib/core/ui/Collection/Item";

export interface ItemRelationSelectProps {
	field: ItemFormFields["fields"]["relatedItems"]["fields"]["relation"];
}

export function ItemRelationSelect(props: ItemRelationSelectProps): ReactNode {
	const { field } = props;

	const itemRelations = useItemRelations({ perpage: 100 });
	const items = itemRelations.data?.itemRelations ?? [];

	return (
		<FormSelect {...field} isLoading={itemRelations.isLoading} items={items}>
			{(item) => {
				return <Item key={item.code}>{item.label}</Item>;
			}}
		</FormSelect>
	);
}
