import { Item } from "@react-stately/collections";
import type { Key, ReactNode } from "react";

import { useUserSearch } from "@/components/account/useUserSearch";
import { useUserSearchFilters } from "@/components/account/useUserSearchFilters";
import type { UserSortOrder } from "@/data/sshoc/api/user";
import { userSortOrders } from "@/data/sshoc/api/user";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { Select } from "@/lib/core/ui/Select/Select";

export function UsersSearchSortOrderSelect(): ReactNode {
	const { t } = useI18n<"authenticated">();
	const searchFilters = useUserSearchFilters();
	const sortOrder = searchFilters.order;
	const { searchUsers } = useUserSearch();

	const items = userSortOrders.map((id) => {
		return {
			id,
			label: t(["authenticated", "users", "sort-by"], {
				values: { order: t(["authenticated", "users", "sort-orders", id]) },
			}),
		};
	});

	function onChange(key: Key) {
		const searchParams = { ...searchFilters, order: key as UserSortOrder };
		searchUsers(searchParams);
	}

	return (
		<Select
			aria-label={t(["authenticated", "users", "sort-order"])}
			items={items}
			onSelectionChange={onChange}
			selectedKey={sortOrder}
		>
			{(item) => {
				return <Item>{item.label}</Item>;
			}}
		</Select>
	);
}
