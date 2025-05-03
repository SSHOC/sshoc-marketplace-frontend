import { useTranslations } from "next-intl";

import type { ItemCategory } from "@/data/sshoc/api/item";
import type { MutationMetadata } from "@/lib/core/query/types";

export interface useuseReviewItemMetaArgs {
	category: ItemCategory;
}

export interface useuseReviewItemMetaResult {
	approve: MutationMetadata;
	reject: MutationMetadata;
}

export function useReviewItemMeta(args: useuseReviewItemMetaArgs): useuseReviewItemMetaResult {
	const { category } = args;

	const t = useTranslations();
	const label = t(`common.item-categories.${category}.one`);

	const approve: MutationMetadata = {
		messages: {
			mutate() {
				return t("authenticated.forms.approve-item-pending", {
					category: label,
				});
			},
			success() {
				return t("authenticated.forms.approve-item-success", {
					category: label,
				});
			},
			error() {
				return t("authenticated.forms.approve-item-error", {
					category: label,
				});
			},
		},
	};

	const reject: MutationMetadata = {
		messages: {
			mutate() {
				return t("authenticated.forms.reject-item-pending", {
					category: label,
				});
			},
			success() {
				return t("authenticated.forms.reject-item-success", {
					category: label,
				});
			},
			error() {
				return t("authenticated.forms.reject-item-error", {
					category: label,
				});
			},
		},
	};

	return { approve, reject };
}
