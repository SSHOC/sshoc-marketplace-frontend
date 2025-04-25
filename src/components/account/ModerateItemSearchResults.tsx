import { ModerateItemSearchResult } from "@/components/account/ModerateItemSearchResult";
import css from "@/components/account/ModerateItemSearchResults.module.css";
import { useModerateItemsSearchResults } from "@/components/account/useModerateItemsSearchResults";
import { NoSearchResultsFound } from "@/components/common/NoSearchResultsFound";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function ModerateItemSearchResults(): JSX.Element {
	const moderateItemSearch = useModerateItemsSearchResults();

	if (moderateItemSearch.data == null) {
		return (
			<section className={css["container"]} data-state="loading">
				<Centered>
					<LoadingIndicator />
				</Centered>
			</section>
		);
	}

	if (moderateItemSearch.data.items.length === 0) {
		return (
			<section className={css["container"]} data-state="empty">
				<NoSearchResultsFound />
			</section>
		);
	}

	return (
		<section className={css["container"]}>
			<ul role="list" className={css["search-results"]}>
				{moderateItemSearch.data.items.map((item) => {
					if (item.category === "step") {
						return null;
					}

					return (
						<li key={[item.persistentId, item.id].join("+")}>
							<ModerateItemSearchResult item={item} />
						</li>
					);
				})}
			</ul>
		</section>
	);
}
