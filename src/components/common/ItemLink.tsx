import type { ReactNode } from "react";

import { Link } from "@/components/common/Link";
import type { Item, ItemCategory } from "@/data/sshoc/api/item";
import { itemRoutes } from "@/lib/core/navigation/item-routes";

export interface ItemLinkProps {
	children?: ReactNode;
	category: ItemCategory;
	persistentId: Item["persistentId"];
	status: Item["status"];
	versionId: Item["id"];
}

export function ItemLink(props: ItemLinkProps): ReactNode {
	const { children, category, persistentId, status, versionId } = props;

	const href =
		status === "approved"
			? itemRoutes.ItemPage(category)({ persistentId })
			: itemRoutes.ItemVersionPage(category)(
					{
						persistentId,
						versionId,
					},
					status === "draft" ? ({ draft: true } as any) : undefined,
				);

	return <Link href={href}>{children}</Link>;
}
