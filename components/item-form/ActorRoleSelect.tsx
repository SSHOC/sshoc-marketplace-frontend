import type { ReactNode } from "react";

import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useActorRoles } from "@/data/sshoc/hooks/actor";
import { FormSelect } from "@/lib/core/form/FormSelect";
import { SelectItem } from "@/lib/core/ui/Select/SelectItem";

export interface ActorRoleSelectProps {
	field: ItemFormFields["fields"]["contributors"]["fields"]["role"];
}

export function ActorRoleSelect(props: ActorRoleSelectProps): ReactNode {
	const { field } = props;

	const actorRoles = useActorRoles();
	const items = actorRoles.data ?? [];

	return (
		<FormSelect {...field} loadingState={actorRoles.isLoading ? "loading" : "idle"} items={items}>
			{(item) => {
				return <SelectItem id={item.code}>{item.label}</SelectItem>;
			}}
		</FormSelect>
	);
}
