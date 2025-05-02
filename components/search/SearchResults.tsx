import type { ReactNode } from "react";

import { ItemPreview } from "@/components/common/ItemPreview";
import { NoSearchResultsFound } from "@/components/common/NoSearchResultsFound";
import { CopyLinkToClipboardButton } from "@/components/search/CopyLinkToClipboardButton";
import css from "@/components/search/SearchResults.module.css";
import { useSearchResults } from "@/components/search/useSearchResults";
import { itemRoutes as routes } from "@/lib/core/navigation/item-routes";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function SearchResults(): ReactNode {
	const itemSearch = useSearchResults();

	if (itemSearch.data == null) {
		return (
			<section className={css["container"]} data-state="loading">
				<Centered>
					<LoadingIndicator />
				</Centered>
			</section>
		);
	}

	if (itemSearch.data.items.length === 0) {
		return (
			<section className={css["container"]} data-state="empty">
				<NoSearchResultsFound />
			</section>
		);
	}

	return (
		<section className={css["container"]}>
			<ul role="list" className={css["search-results"]}>
				{itemSearch.data.items.map((item) => {
					return (
						<li key={[item.persistentId, item.id].join("+")}>
							<div className={css["search-result"]}>
								<ItemPreview
									controls={
										item.category !== "step" ? (
											<span className={css["controls"]}>
												<CopyLinkToClipboardButton
													href={routes.ItemPage(item.category)({ persistentId: item.persistentId })}
												/>
											</span>
										) : null
									}
									item={item}
								/>
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
