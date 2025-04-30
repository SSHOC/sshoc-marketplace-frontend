import type { ItemCategory } from "@/data/sshoc/api/item";
import { useI18n } from "@/lib/core/i18n/useI18n";
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

	const { t } = useI18n<"authenticated" | "common">();
	const label = t(["common", "item-categories", category, "one"]);

	const approve: MutationMetadata = {
		messages: {
			mutate() {
				return t(["authenticated", "forms", "approve-item-pending"], {
					values: { category: label },
				});
			},
			success() {
				return t(["authenticated", "forms", "approve-item-success"], {
					values: { category: label },
				});
			},
			error() {
				return t(["authenticated", "forms", "approve-item-error"], {
					values: { category: label },
				});
			},
		},
	};

	const reject: MutationMetadata = {
		messages: {
			mutate() {
				return t(["authenticated", "forms", "reject-item-pending"], {
					values: { category: label },
				});
			},
			success() {
				return t(["authenticated", "forms", "reject-item-success"], {
					values: { category: label },
				});
			},
			error() {
				return t(["authenticated", "forms", "reject-item-error"], {
					values: { category: label },
				});
			},
		},
	};

	return { approve, reject };
}
