import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useFormState } from "react-final-form";

import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { Link } from "@/components/common/Link";
import { Timestamp } from "@/components/common/Timestamp";
import css from "@/components/item-form/OtherSuggestedItemVersionsFormSection.module.css";
import type { Item, ItemCategory } from "@/data/sshoc/api/item";
import { useDatasetHistory } from "@/data/sshoc/hooks/dataset";
import { usePublicationHistory } from "@/data/sshoc/hooks/publication";
import { useToolHistory } from "@/data/sshoc/hooks/tool-or-service";
import { useTrainingMaterialHistory } from "@/data/sshoc/hooks/training-material";
import { useWorkflowHistory } from "@/data/sshoc/hooks/workflow";
import { isNotFoundError } from "@/data/sshoc/utils/isNotFoundError";
import { itemRoutes } from "@/lib/core/navigation/item-routes";
import type { QueryMetadata } from "@/lib/core/query/types";

export function OtherSuggestedItemVersionsFormSection(): ReactNode {
	const t = useTranslations();
	const item = useFormState().initialValues as Item;

	const { category, persistentId, id: versionId } = item;

	/** For newly suggested items there will be no item history available. */
	const meta: QueryMetadata = {
		messages: {
			error(error) {
				if (isNotFoundError(error)) {
					return false;
				}
				return undefined;
			},
		},
	};
	const items = useItemHistory(category)({ persistentId, approved: false }, undefined, {
		meta,
		select(data) {
			return data.filter((item) => {
				return ["suggested", "ingested"].includes(item.status) && item.id !== versionId;
			});
		},
	});

	if (items.data == null || items.data.length === 0) {
		return null;
	}

	return (
		<FormSection>
			<FormSectionTitle>
				{t("authenticated.forms.other-suggested-versions-section")}
			</FormSectionTitle>
			<p>
				{t(
					`authenticated.other-suggested-versions.message.${
						items.data.length === 1 ? "one" : "other"
					}`,
					{ count: String(items.data.length) },
				)}
			</p>
			<ul className={css["items"]} role="list">
				{items.data.map((item) => {
					return (
						<li key={[item.persistentId, item.id].join("+")}>
							<article className={css["item"]}>
								<h4>
									<Link href={itemRoutes.ItemReviewPage(category)({ persistentId, versionId })}>
										{item.label}
									</Link>
								</h4>
								<small className={css["item-info"]}>
									{t.rich("authenticated.other-suggested-versions.suggested-by", {
										name: item.informationContributor.displayName,
										// eslint-disable-next-line react/no-unstable-nested-components
										Timestamp() {
											return <Timestamp dateTime={item.lastInfoUpdate} />;
										},
									})}
								</small>
							</article>
						</li>
					);
				})}
			</ul>
			<p>{t("authenticated.other-suggested-versions.warning")}</p>
		</FormSection>
	);
}

function useItemHistory(category: ItemCategory) {
	switch (category) {
		case "dataset":
			return useDatasetHistory;
		case "publication":
			return usePublicationHistory;
		case "tool-or-service":
			return useToolHistory;
		case "training-material":
			return useTrainingMaterialHistory;
		case "workflow":
			return useWorkflowHistory;
	}
}
