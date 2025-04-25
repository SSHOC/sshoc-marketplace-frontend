import css from "@/components/account/DraftItemSearchResultsFooter.module.css";
import { DraftItemSearchResultsPageNavigation } from "@/components/account/DraftItemSearchResultsPageNavigation";

export function DraftItemSearchResultsFooter(): JSX.Element {
	return (
		<aside className={css["container"]}>
			<div className={css["input"]}>
				<DraftItemSearchResultsPageNavigation variant="input" />
			</div>
			<div className={css["long"]}>
				<DraftItemSearchResultsPageNavigation />
			</div>
		</aside>
	);
}
