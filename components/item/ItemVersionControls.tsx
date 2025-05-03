import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { LinkButton } from "@/components/common/LinkButton";
import css from "@/components/item/ItemVersionControls.module.css";
import type { Item, ItemCategory, ItemStatus } from "@/data/sshoc/api/item";
import { useDeleteDatasetVersion } from "@/data/sshoc/hooks/dataset";
import { useDeletePublicationVersion } from "@/data/sshoc/hooks/publication";
import { useDeleteToolVersion } from "@/data/sshoc/hooks/tool-or-service";
import { useDeleteTrainingMaterialVersion } from "@/data/sshoc/hooks/training-material";
import { useDeleteWorkflowVersion } from "@/data/sshoc/hooks/workflow";
import { AccessControl } from "@/lib/core/auth/AccessControl";
import { itemRoutes } from "@/lib/core/navigation/item-routes";
import type { MutationMetadata } from "@/lib/core/query/types";
import { Button } from "@/lib/core/ui/Button/Button";

export interface ItemVersionControlsProps {
	category: ItemCategory;
	persistentId: Item["persistentId"];
	status: ItemStatus;
	versionId: Item["id"];
}

export function ItemVersionControls(props: ItemVersionControlsProps): ReactNode {
	const { category, persistentId, status, versionId } = props;

	const t = useTranslations();

	return (
		<AccessControl>
			<div className={css["container"]}>
				<LinkButton
					href={itemRoutes.ItemEditVersionPage(category)(
						{ persistentId, versionId },
						status === "draft" ? ({ draft: true } as any) : undefined,
					)}
					color="secondary"
					size="xs"
				>
					{t("common.controls.edit-version")}
				</LinkButton>

				<LinkButton
					href={itemRoutes.ItemHistoryPage(category)({ persistentId })}
					color="secondary"
					size="xs"
				>
					{t("common.controls.history")}
				</LinkButton>
				<AccessControl roles={["administrator"]}>
					<DeleteItemVersionButton
						category={category}
						persistentId={persistentId}
						versionId={versionId}
					/>
				</AccessControl>
			</div>
		</AccessControl>
	);
}

interface DeleteItemButtonProps {
	category: ItemCategory;
	persistentId: Item["persistentId"];
	versionId: Item["id"];
}

function DeleteItemVersionButton(props: DeleteItemButtonProps): ReactNode {
	const { category, persistentId, versionId } = props;

	const t = useTranslations();
	const router = useRouter();

	const label = t(`common.item-categories.${category}.one`);

	const meta: MutationMetadata = {
		messages: {
			mutate() {
				return t("common.controls.delete-item-version-pending", {
					category: label,
				});
			},
			success() {
				return t("common.controls.delete-item-version-success", {
					category: label,
				});
			},
			error() {
				return t("common.controls.delete-item-version-error", {
					category: label,
				});
			},
		},
	};
	const deleteItemVersion = useDeleteItemVersion(category)({ persistentId, versionId }, undefined, {
		meta,
		onSuccess() {
			router.push(`/account`);
		},
	});

	function onDelete() {
		deleteItemVersion.mutate();
	}

	return (
		<Button color="negative" onPress={onDelete} size="xs">
			{t("common.controls.delete")}
		</Button>
	);
}

function useDeleteItemVersion(category: ItemCategory) {
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
