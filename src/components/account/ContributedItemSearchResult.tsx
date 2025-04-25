import { ItemLink } from "@/components/common/ItemLink";
import { Link } from "@/components/common/Link";
import { MetadataLabel } from "@/components/common/MetadataLabel";
import { MetadataValue } from "@/components/common/MetadataValue";
import { MetadataValues } from "@/components/common/MetadataValues";
import { SearchResult } from "@/components/common/SearchResult";
import { SearchResultContent } from "@/components/common/SearchResultContent";
import { SearchResultControls } from "@/components/common/SearchResultControls";
import { SearchResultMeta } from "@/components/common/SearchResultMeta";
import { SearchResultTitle } from "@/components/common/SearchResultTitle";
import { Timestamp } from "@/components/common/Timestamp";
import type { ContributedItem } from "@/data/sshoc/api/item";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { itemRoutes } from "@/lib/core/navigation/item-routes";

export interface ContributedItemSearchResultProps {
	item: ContributedItem;
}

export function ContributedItemSearchResult(
	props: ContributedItemSearchResultProps,
): JSX.Element | null {
	const { item } = props;

	const { t } = useI18n<"authenticated" | "common">();

	return (
		<SearchResult>
			<SearchResultTitle>
				<ItemLink
					category={item.category}
					persistentId={item.persistentId}
					status={item.status}
					versionId={item.id}
				>
					{item.label}
				</ItemLink>
			</SearchResultTitle>
			<SearchResultMeta>
				<MetadataValue size="sm">
					<MetadataLabel size="sm">
						{t(["authenticated", "contributed-items", "last-updated"])}:
					</MetadataLabel>
					<Timestamp dateTime={item.lastInfoUpdate} />
				</MetadataValue>
			</SearchResultMeta>
			<SearchResultContent>
				<MetadataValues>
					<MetadataValue>
						<MetadataLabel>{t(["common", "item", "item-category", "one"])}:</MetadataLabel>
						<span>{t(["common", "item-categories", item.category, "one"])}</span>
					</MetadataValue>
					<MetadataValue>
						<MetadataLabel>{t(["common", "item", "status"])}:</MetadataLabel>
						<span>{t(["common", "item-status", item.status])}</span>
					</MetadataValue>
				</MetadataValues>
			</SearchResultContent>
			<SearchResultControls>
				{item.status === "approved" ? (
					<Link
						href={itemRoutes.ItemEditPage(item.category)({ persistentId: item.persistentId })}
						aria-label={t(["authenticated", "contributed-items", "edit-item"], {
							values: { label: item.label },
						})}
					>
						{t(["authenticated", "controls", "edit"])}
					</Link>
				) : null}
				{["draft", "suggested", "ingested"].includes(item.status) ? (
					<Link
						href={itemRoutes.ItemEditVersionPage(item.category)({
							persistentId: item.persistentId,
							versionId: item.id,
						})}
						aria-label={t(["authenticated", "contributed-items", "edit-item"], {
							values: { label: item.label },
						})}
					>
						{t(["authenticated", "controls", "edit"])}
					</Link>
				) : null}
			</SearchResultControls>
		</SearchResult>
	);
}
