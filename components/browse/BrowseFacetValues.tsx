import { useCollator } from "@react-aria/i18n";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { createUrlSearchParams } from "@stefanprobst/request";
import { useTranslations } from "next-intl";
import { type ReactNode, useMemo } from "react";

import css from "@/components/browse/BrowseFacetValues.module.css";
import { Link } from "@/components/common/Link";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { ItemFacet, ItemSearch } from "@/data/sshoc/api/item";
import { useItemSearch } from "@/data/sshoc/hooks/item";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export interface BrowseFacetValuesProps {
	facet: ItemFacet;
}
export function BrowseFacetValues(props: BrowseFacetValuesProps): ReactNode {
	const { facet } = props;

	const itemSearch = useItemSearch({});

	if (itemSearch.data == null) {
		return (
			<Centered>
				<LoadingIndicator />
			</Centered>
		);
	}

	return <FacetValues facet={facet} values={itemSearch.data.facets[facet]} />;
}

interface FacetValuesProps {
	facet: ItemFacet;
	values: ItemSearch.Response["facets"][ItemFacet];
}

function FacetValues(props: FacetValuesProps): ReactNode {
	const { facet, values } = props;

	const t = useTranslations();
	const grouped = useGroupedFacetValues({ values });

	return (
		<ul role="list" className={css["groups"]}>
			{grouped.map(([firstCharacter, values]) => {
				return (
					<li key={firstCharacter} className={css["group"]}>
						<div className={css["group-header"]}>
							<SectionTitle>
								<VisuallyHidden>
									{t("common.browse.values-by-character", {
										character: firstCharacter,
									})}
								</VisuallyHidden>
								<span aria-hidden>{firstCharacter.toUpperCase()}</span>
							</SectionTitle>
						</div>
						<ul role="list" className={css["list"]}>
							{values.map(([value, count]) => {
								const query = { [`f.${facet}`]: [value] } as {
									[K in ItemFacet as `f.${K}`]: Array<string>;
								};

								return (
									<li key={value} className={css["list-item"]}>
										<Link href={`/search?${createUrlSearchParams(query)}`}>
											{value}
											<span>{count}</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</li>
				);
			})}
		</ul>
	);
}

interface UseGroupedFacetValuesArgs {
	values: ItemSearch.Response["facets"][ItemFacet];
}

function useGroupedFacetValues(
	args: UseGroupedFacetValuesArgs,
): Array<[string, Array<[string, number]>]> {
	const { values } = args;

	const createCollator = useCollator();
	const grouped = useMemo(() => {
		const compare = createCollator();

		const grouped = new Map<string, Map<string, number>>();

		Object.entries(values).forEach(([value, { count }]) => {
			const firstCharacter = value.charAt(0).toUpperCase();

			if (!grouped.has(firstCharacter)) {
				grouped.set(firstCharacter, new Map());
			}

			const group = grouped.get(firstCharacter)!;

			group.set(value, count);
		});

		const sortedGroups = Array.from(grouped).sort(([firstCharacter], [otherFirstCharacter]) => {
			return compare(firstCharacter, otherFirstCharacter);
		});

		const sorted = sortedGroups.map(([firstCharacter, values]) => {
			return [
				firstCharacter,
				Array.from(values).sort(([value], [otherValue]) => {
					return compare(value, otherValue);
				}),
			];
		});

		return sorted as Array<[string, Array<[string, number]>]>;
	}, [values, createCollator]);

	return grouped;
}
