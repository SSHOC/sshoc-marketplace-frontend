import { createUrlSearchParams } from "@stefanprobst/request";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/common/Link";
import { SectionTitle } from "@/components/home/SectionTitle";
import { SubSectionHeader } from "@/components/home/SubSectionHeader";
import { SubSectionHeaderLink } from "@/components/home/SubSectionHeaderLink";
import { SubSectionTitle } from "@/components/home/SubSectionTitle";
import { maxBrowseFacets, maxLastAddedItems } from "@/config/sshoc.config";
import type { ItemFacet, ItemSearch } from "@/data/sshoc/api/item";
import { useItemSearch } from "@/data/sshoc/hooks/item";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";
import { length } from "@/lib/utils";

export function BrowseItems(): ReactNode {
	const t = useTranslations();
	/**
	 * Match the request from `LastUpdatedItems` so it can be de-duplicated.
	 * Here we only need the list of facet values.
	 */
	const itemSearch = useItemSearch({
		order: ["modified-on"],
		perpage: maxLastAddedItems,
	});

	if (itemSearch.data == null) {
		return (
			<section className="grid content-start gap-8 py-16 [grid-area:browse-items]">
				<Centered>
					<LoadingIndicator />
				</Centered>
			</section>
		);
	}

	const { activity, keyword } = itemSearch.data.facets;

	return (
		<section className="grid content-start gap-8 py-16 [grid-area:browse-items]">
			<SectionTitle>{t("common.home.browse")}</SectionTitle>
			<BrowseLinks
				title={t("common.home.browse-by-facet", {
					facet: t("common.facets.activity.other"),
				})}
				values={activity}
				facet="activity"
			/>
			<BrowseLinks
				title={t("common.home.browse-by-facet", {
					facet: t("common.facets.keyword.other"),
				})}
				values={keyword}
				facet="keyword"
			/>
		</section>
	);
}

interface BrowseLinksProps {
	title: string;
	values: ItemSearch.Response["facets"][ItemFacet];
	facet: ItemFacet;
}

function BrowseLinks(props: BrowseLinksProps): ReactNode {
	const { title, values, facet } = props;

	const t = useTranslations();

	if (length(values) === 0) {
		return null;
	}

	return (
		<section className="grid gap-6">
			<SubSectionHeader>
				<SubSectionTitle>{title}</SubSectionTitle>
				<SubSectionHeaderLink
					aria-label={t("common.see-all-facets", {
						facet: t(`common.facets.${facet}.other`),
					})}
					href={`/browse/${facet}`}
				>
					{t("common.see-all")}
				</SubSectionHeaderLink>
			</SubSectionHeader>
			<ul role="list" className="flex flex-wrap gap-x-6 gap-y-3">
				{Object.entries(values)
					.slice(0, maxBrowseFacets)
					.map(([value, { count }]) => {
						const query = { [`f.${facet}`]: [value] } as {
							[K in ItemFacet as `f.${K}`]: Array<string>;
						};

						if (count === 0) {
							return null;
						}

						return (
							<li key={value}>
								<Link href={`/search?${createUrlSearchParams(query)}`} variant="tag">
									<span>{value}</span>
									<span className="text-neutral-600">({count})</span>
								</Link>
							</li>
						);
					})}
			</ul>
		</section>
	);
}
