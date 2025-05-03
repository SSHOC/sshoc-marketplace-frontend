import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ItemLink } from "@/components/common/ItemLink";
import { Link } from "@/components/common/Link";
import { MetadataLabel } from "@/components/common/MetadataLabel";
import { MetadataValue } from "@/components/common/MetadataValue";
import { SearchResult } from "@/components/common/SearchResult";
import { SearchResultContent } from "@/components/common/SearchResultContent";
import { SearchResultControls } from "@/components/common/SearchResultControls";
import { SearchResultMeta } from "@/components/common/SearchResultMeta";
import { SearchResultTitle } from "@/components/common/SearchResultTitle";
import { Timestamp } from "@/components/common/Timestamp";
import type { GetDraftItems, ItemCategory } from "@/data/sshoc/api/item";
import { useDeleteDatasetVersion } from "@/data/sshoc/hooks/dataset";
import { useDeletePublicationVersion } from "@/data/sshoc/hooks/publication";
import { useDeleteToolVersion } from "@/data/sshoc/hooks/tool-or-service";
import { useDeleteTrainingMaterialVersion } from "@/data/sshoc/hooks/training-material";
import { useDeleteWorkflowVersion } from "@/data/sshoc/hooks/workflow";
import { itemRoutes } from "@/lib/core/navigation/item-routes";
import type { MutationMetadata } from "@/lib/core/query/types";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";

export interface DraftItemSearchResultProps {
	item: GetDraftItems.Response["items"][number] & { category: ItemCategory };
}

export function DraftItemSearchResult(props: DraftItemSearchResultProps): ReactNode {
	const { item } = props;

	const t = useTranslations();

	const meta: MutationMetadata = {
		messages: {
			mutate() {
				return t("authenticated.draft-items.delete-draft-item-pending");
			},
			success() {
				return t("authenticated.draft-items.delete-draft-item-success");
			},
			error() {
				return t("authenticated.draft-items.delete-draft-item-error");
			},
		},
	};
	const deleteDraftItem = useDeleteDraftItem(item.category)(
		{ persistentId: item.persistentId, versionId: item.id },
		undefined,
		{ meta },
	);

	function onDeleteDraftItem() {
		deleteDraftItem.mutate();
	}

	return (
		<SearchResult>
			<SearchResultTitle>
				<ItemLink
					category={item.category}
					persistentId={item.persistentId}
					status="draft"
					versionId={item.id}
				>
					{item.label}
				</ItemLink>
			</SearchResultTitle>
			<SearchResultMeta>
				<MetadataValue size="sm">
					<MetadataLabel size="sm">{t("authenticated.draft-items.last-updated")}:</MetadataLabel>
					<Timestamp dateTime={item.lastInfoUpdate} />
				</MetadataValue>
			</SearchResultMeta>
			<SearchResultContent>
				<MetadataValue>
					<MetadataLabel>{t("common.item.item-category.one")}:</MetadataLabel>
					<span>{t(`common.item-categories.${item.category}.one`)}</span>
				</MetadataValue>
			</SearchResultContent>
			<SearchResultControls>
				<ButtonLink
					aria-label={t("authenticated.draft-items.delete-item", {
						label: item.label,
					})}
					onPress={onDeleteDraftItem}
				>
					{t("authenticated.controls.delete")}
				</ButtonLink>
				<Link
					href={itemRoutes.ItemEditVersionPage(item.category)(
						{
							persistentId: item.persistentId,
							versionId: item.id,
						},
						{ draft: true },
					)}
					aria-label={t("authenticated.draft-items.edit-item", {
						label: item.label,
					})}
				>
					{t("authenticated.controls.edit")}
				</Link>
			</SearchResultControls>
		</SearchResult>
	);
}

function useDeleteDraftItem(category: ItemCategory) {
	switch (category) {
		case "dataset":
			return useDeleteDatasetVersion;
		case "publication":
			return useDeletePublicationVersion;
		case "tool-or-service":
			return useDeleteToolVersion;
		case "training-material":
			return useDeleteTrainingMaterialVersion;
		case "workflow":
			return useDeleteWorkflowVersion;
	}
}
