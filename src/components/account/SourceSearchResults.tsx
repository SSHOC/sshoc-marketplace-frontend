import { SourceSearchResult } from "@/components/account/SourceSearchResult";
import css from "@/components/account/SourceSearchResults.module.css";
import { useSourceSearchResults } from "@/components/account/useSourceSearchResults";
import { NoSearchResultsFound } from "@/components/common/NoSearchResultsFound";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function SourceSearchResults(): JSX.Element {
	const sourceSearch = useSourceSearchResults();

	if (sourceSearch.data == null) {
		return (
			<section className={css["container"]} data-state="loading">
				<Centered>
					<LoadingIndicator />
				</Centered>
			</section>
		);
	}

	if (sourceSearch.data.sources.length === 0) {
		return (
			<section className={css["container"]} data-state="empty">
				<NoSearchResultsFound />
			</section>
		);
	}

	return (
		<section className={css["container"]}>
			<ul role="list" className={css["search-results"]}>
				{sourceSearch.data.sources.map((source) => {
					return (
						<li key={source.id}>
							<SourceSearchResult source={source} />
						</li>
					);
				})}
			</ul>
		</section>
	);
}
