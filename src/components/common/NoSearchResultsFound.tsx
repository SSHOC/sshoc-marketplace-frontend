import type { ReactNode } from "react";

import css from "@/components/common/NoSearchResultsFound.module.css";
import { useI18n } from "@/lib/core/i18n/useI18n";
import NothingFoundImage from "~/public/assets/images/search/nothing-found.svg?symbol-icon";

export function NoSearchResultsFound(): ReactNode {
	const { t } = useI18n<"common">();

	return (
		<div className={css["container"]} role="status">
			<div className={css["image-container"]}>
				<NothingFoundImage aria-hidden />
			</div>
			<strong className={css["heading"]}>{t(["common", "search", "no-results"])}</strong>
			<p>{t(["common", "search", "nothing-found-message"])}</p>
		</div>
	);
}
