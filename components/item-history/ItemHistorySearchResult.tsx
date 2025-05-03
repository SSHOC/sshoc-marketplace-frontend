import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

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
import type { ItemCategory, ItemHistoryEntry } from "@/data/sshoc/api/item";
import { useRevertDatasetToVersion } from "@/data/sshoc/hooks/dataset";
import { useRevertPublicationToVersion } from "@/data/sshoc/hooks/publication";
import { useRevertToolToVersion } from "@/data/sshoc/hooks/tool-or-service";
import { useRevertTrainingMaterialToVersion } from "@/data/sshoc/hooks/training-material";
import { useRevertWorkflowToVersion } from "@/data/sshoc/hooks/workflow";
import { AccessControl } from "@/lib/core/auth/AccessControl";
import { itemRoutes } from "@/lib/core/navigation/item-routes";
import type { MutationMetadata } from "@/lib/core/query/types";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { isNonEmptyString } from "@/lib/utils";

export interface ItemHistorySearchResultProps {
	item: ItemHistoryEntry & { category: ItemCategory };
}

export function ItemHistorySearchResult(props: ItemHistorySearchResultProps): ReactNode {
	const { item } = props;

	const t = useTranslations();

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
					{isNonEmptyString(item.version) ? <span> ({item.version})</span> : null}
				</ItemLink>
			</SearchResultTitle>
			<SearchResultMeta>
				<MetadataValue size="sm">
					<MetadataLabel size="sm">{t("common.item.last-info-update")}:</MetadataLabel>
					<Timestamp dateTime={item.lastInfoUpdate} />
				</MetadataValue>
			</SearchResultMeta>
			<SearchResultContent>
				<MetadataValues>
					<MetadataValue>
						<MetadataLabel>{t("common.item.status")}:</MetadataLabel>
						<span>{t(`common.item-status.${item.status}`)}</span>
					</MetadataValue>
					<MetadataValue>
						<MetadataLabel>{t("common.item.content-contributors.one")}:</MetadataLabel>
						<span>{item.informationContributor.displayName}</span>
					</MetadataValue>
				</MetadataValues>
			</SearchResultContent>
			<SearchResultControls>
				{item.status === "approved" ? (
					<Link href={itemRoutes.ItemEditPage(item.category)({ persistentId: item.persistentId })}>
						{t("authenticated.controls.edit")}
					</Link>
				) : null}
				<AccessControl roles={["administrator", "moderator"]}>
					{item.status === "deprecated" ? <RevertButton item={item} /> : null}
				</AccessControl>
			</SearchResultControls>
		</SearchResult>
	);
}

interface RevertButtonProps {
	item: ItemHistorySearchResultProps["item"];
}

function RevertButton(props: RevertButtonProps): ReactNode {
	const { item } = props;
	const { category, persistentId, id: versionId } = item;

	const t = useTranslations();

	const meta: MutationMetadata = {
		messages: {
			mutate() {
				return t("authenticated.item-history.revert-to-version-pending");
			},
			success() {
				return t("authenticated.item-history.revert-to-version-success");
			},
			error() {
				return t("authenticated.item-history.revert-to-version-error");
			},
		},
	};
	const revertItemToVersion = useRevertItemToVersion(category)(
		{ persistentId, versionId },
		undefined,
		{ meta },
	);

	function onRevert() {
		revertItemToVersion.mutate();
	}

	return <ButtonLink onPress={onRevert}>{t("authenticated.controls.revert")}</ButtonLink>;
}

function useRevertItemToVersion(category: ItemCategory) {
	switch (category) {
		case "dataset":
			return useRevertDatasetToVersion;
		case "publication":
			return useRevertPublicationToVersion;
		case "tool-or-service":
			return useRevertToolToVersion;
		case "training-material":
			return useRevertTrainingMaterialToVersion;
		case "workflow":
			return useRevertWorkflowToVersion;
	}
}
