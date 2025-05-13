import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

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
import { useReviewItemMeta } from "@/components/item-form/useReviewItemMeta";
import type { ItemCategory, ItemSearch } from "@/data/sshoc/api/item";
import { useApproveDatasetVersion, useRejectDatasetVersion } from "@/data/sshoc/hooks/dataset";
import {
	useApprovePublicationVersion,
	useRejectPublicationVersion,
} from "@/data/sshoc/hooks/publication";
import { useApproveToolVersion, useRejectToolVersion } from "@/data/sshoc/hooks/tool-or-service";
import {
	useApproveTrainingMaterialVersion,
	useRejectTrainingMaterialVersion,
} from "@/data/sshoc/hooks/training-material";
import { useApproveWorkflowVersion, useRejectWorkflowVersion } from "@/data/sshoc/hooks/workflow";
import { itemRoutes } from "@/lib/core/navigation/item-routes";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";

export interface ModerateItemSearchResultProps {
	item: ItemSearch.Response["items"][number] & { category: ItemCategory };
}

export function ModerateItemSearchResult(props: ModerateItemSearchResultProps): ReactNode {
	const { item } = props;
	const { category, persistentId, id: versionId } = item;

	const t = useTranslations();
	const meta = useReviewItemMeta({ category });

	const approveItem = useApproveItemVersion(category)({ persistentId, versionId }, undefined, {
		meta: meta.approve,
	});

	const rejectItem = useRejectItemVersion(category)({ persistentId, versionId }, undefined, {
		meta: meta.reject,
	});

	function onApprove() {
		approveItem.mutate();
	}

	function onReject() {
		rejectItem.mutate();
	}

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
					<MetadataLabel size="sm">{t("authenticated.moderate-items.last-updated")}:</MetadataLabel>
					<Timestamp dateTime={item.lastInfoUpdate} />
				</MetadataValue>
			</SearchResultMeta>
			<SearchResultContent>
				<MetadataValues>
					<MetadataValue>
						<MetadataLabel>{t("common.item.item-category.one")}:</MetadataLabel>
						<span>{t(`common.item-categories.${item.category}.one`)}</span>
					</MetadataValue>
					<MetadataValue>
						<MetadataLabel>{t("common.item.status")}:</MetadataLabel>
						<span>{t(`common.item-status.${item.status}`)}</span>
					</MetadataValue>
				</MetadataValues>
			</SearchResultContent>
			<SearchResultControls>
				{["suggested", "ingested"].includes(item.status) ? (
					<Fragment>
						<ButtonLink onPress={onApprove}>{t("authenticated.controls.approve")}</ButtonLink>
						<ButtonLink onPress={onReject}>{t("authenticated.controls.reject")}</ButtonLink>
						<Link
							href={itemRoutes.ItemReviewPage(item.category)({
								persistentId: item.persistentId,
								versionId: item.id,
							})}
							aria-label={t("authenticated.moderate-items.review-item", {
								label: item.label,
							})}
						>
							{t("authenticated.controls.review")}
						</Link>
					</Fragment>
				) : null}
			</SearchResultControls>
		</SearchResult>
	);
}

function useApproveItemVersion(category: ItemCategory) {
	switch (category) {
		case "dataset":
			return useApproveDatasetVersion;
		case "publication":
			return useApprovePublicationVersion;
		case "tool-or-service":
			return useApproveToolVersion;
		case "training-material":
			return useApproveTrainingMaterialVersion;
		case "workflow":
			return useApproveWorkflowVersion;
	}
}

function useRejectItemVersion(category: ItemCategory) {
	switch (category) {
		case "dataset":
			return useRejectDatasetVersion;
		case "publication":
			return useRejectPublicationVersion;
		case "tool-or-service":
			return useRejectToolVersion;
		case "training-material":
			return useRejectTrainingMaterialVersion;
		case "workflow":
			return useRejectWorkflowVersion;
	}
}
