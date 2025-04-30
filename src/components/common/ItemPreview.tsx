import type { ReactNode } from "react";

import { ItemCategoryBadge } from "@/components/common/ItemCategoryBadge";
import { ItemCategoryIcon } from "@/components/common/ItemCategoryIcon";
import { ItemDescription } from "@/components/common/ItemDescription";
import css from "@/components/common/ItemPreview.module.css";
import { ItemPreviewMetadata } from "@/components/common/ItemPreviewMetadata";
import { Link } from "@/components/common/Link";
import type { ItemSearchResult, RelatedItem } from "@/data/sshoc/api/item";
import {} from "@/data/sshoc/api/vocabulary";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { itemRoutes as routes } from "@/lib/core/navigation/item-routes";

export interface ItemPreviewProps {
	controls?: ReactNode;
	item: ItemSearchResult | RelatedItem;
	/** @default 3 */
	headingLevel?: 2 | 3 | 4 | 5;
}

export function ItemPreview(props: ItemPreviewProps): ReactNode {
	const { controls = null, item, headingLevel = 2 } = props;

	const { t } = useI18n<"common">();

	const href =
		item.category === "step"
			? routes.ItemPage("workflow")({ persistentId: item.workflowId }, { step: item.persistentId })
			: routes.ItemPage(item.category)({ persistentId: item.persistentId });

	const ElementType = `h${headingLevel}` as const;

	return (
		<article className={css["container"]}>
			<ItemCategoryBadge category={item.category} />
			<ElementType className={css["title"]}>
				<ItemCategoryIcon category={item.category} />
				<Link href={href} variant="heading">
					<span>{item.label}</span>
				</Link>
				{controls}
			</ElementType>
			<ItemPreviewMetadata item={item} />
			<ItemDescription text={item.description} />
			<div className={css["read-more-link"]}>
				<Link
					href={href}
					aria-label={t(["common", "read-more-about-item"], { values: { item: item.label } })}
				>
					{t(["common", "read-more"])}
				</Link>
			</div>
		</article>
	);
}
