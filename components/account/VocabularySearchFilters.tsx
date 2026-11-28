import css from "@/components/account/VocabularySearchFilters.module.css";
import buttonCss from "@/lib/core/ui/Button/Button.module.css";

import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useTranslations } from "next-intl";
import type { FormEvent, ReactNode } from "react";
import { Button as AriaButton, DialogTrigger, Heading } from "react-aria-components";

import { useVocabularySearch } from "@/components/account/useVocabularySearch";
import type { SearchFilters } from "@/components/account/useVocabularySearchFilters";
import { useVocabularySearchFilters } from "@/components/account/useVocabularySearchFilters";
import { useVocabularySearchResults } from "@/components/account/useVocabularySearchResults";
import { getTopFacetValues } from "@/components/common/getTopFacetValues";
import { Link } from "@/components/common/Link";
import { SearchFacetsOverlay } from "@/components/common/SearchFacetsOverlay";
import { ModalDialog } from "@/components/search/ModalDialog";
import type { ConceptStatus } from "@/data/sshoc/utils/concept";
import { conceptStatus, mapConceptStatusToFacet } from "@/data/sshoc/utils/concept";
import { CheckBoxGroup } from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup";
import { CloseButton } from "@/lib/core/ui/CloseButton/CloseButton";
import { Facet, Item as FacetValue } from "@/lib/core/ui/Facet/Facet";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import CrossIcon from "@/lib/core/ui/icons/cross";
import { length } from "@/lib/utils";

export function VocabularySearchFilters(): ReactNode {
	const t = useTranslations();

	return (
		<aside className={css["container"]}>
			<header className={css["section-header"]}>
				<h2 className={css["section-title"]}>{t("common.search.refine-search")}</h2>
				<div className={css["clear-link"]}>
					<Link href="/account/vocabularies">{t("common.search.clear-filters")}</Link>
				</div>
			</header>
			<div className={css["facets-form-container"]}>
				<SearchFacetsForm />
			</div>
			<div className={css["facets-dialog-container"]}>
				<SearchFacetsDialog />
			</div>
		</aside>
	);
}

function SearchFacetsDialog(): ReactNode {
	const t = useTranslations();

	return (
		<>
			<DialogTrigger>
				<AriaButton
					className={buttonCss["button"]}
					data-color="gradient"
					data-size="md"
					data-variant="fill"
					data-dialog="facets"
				>
					{t("common.search.refine-search")}
				</AriaButton>
				<ModalDialog isDismissable>
					{({ close }) => (
						<>
							<header className={css["overlay-header"]}>
								<Heading slot="title" level={2} className={css["overlay-title"]}>
									{t("common.search.refine-search")}
								</Heading>
								<CloseButton autoFocus onPress={close} size="lg" />
							</header>
							<SearchFacetsForm />
						</>
					)}
				</ModalDialog>
			</DialogTrigger>
			<ActiveSearchFacets />
		</>
	);
}

function ActiveSearchFacets(): ReactNode {
	const searchFilters = useVocabularySearchFilters();

	const activeFilters = [searchFilters["types"]];

	if (
		activeFilters.every((facet) => {
			return facet.length === 0;
		})
	) {
		return null;
	}

	return (
		<section className={css["active-facets"]}>
			<ActiveConceptStatusFacets />
			<ActivePropertyTypesFacets />
		</section>
	);
}

interface RemoveFacetValueButtonProps {
	name: Exclude<keyof SearchFilters, "order" | "page" | "perpage" | "q">;
	value: string;
	label: ReactNode;
}

function RemoveFacetValueButton(props: RemoveFacetValueButtonProps): ReactNode {
	const { name, value, label } = props;

	const searchFilters = useVocabularySearchFilters();
	const { searchVocabularies } = useVocabularySearch();

	function onPress() {
		searchVocabularies({
			...searchFilters,
			[name]: searchFilters[name].filter((v) => {
				return v !== value;
			}),
		});
	}

	return (
		<AriaButton onPress={onPress} className={css["remove-facet-value-button"]}>
			<VisuallyHidden>{label}</VisuallyHidden>
			<Icon icon={CrossIcon} />
		</AriaButton>
	);
}

function ActiveConceptStatusFacets() {
	const name = "f.status";

	const t = useTranslations();
	const searchFilters = useVocabularySearchFilters();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>{t("common.item.status")}</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{values.map((value) => {
					return (
						<li key={value} className={css["active-facet-value"]}>
							{t(`authenticated.concepts.concept-status.${value}`)}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t("common.search.remove-filter-value", {
									facet: t("authenticated.concepts.status"),
									value: t(`authenticated.concepts.concept-status.${value}`),
								})}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function ActivePropertyTypesFacets() {
	const name = "types";

	const t = useTranslations();
	const searchFilters = useVocabularySearchFilters();
	const searchResults = useVocabularySearchResults();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>
				{t("authenticated.concepts.property-type.other")}
			</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{values.map((value) => {
					const label = searchResults.data?.types[value]?.label ?? value;

					return (
						<li key={value} className={css["active-facet-value"]}>
							{label}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t("common.search.remove-filter-value", {
									facet: t("authenticated.concepts.property-type.one"),
									value: label,
								})}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function SearchFacetsForm(): ReactNode {
	const searchFilters = useVocabularySearchFilters();

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
	}

	return (
		<form onSubmit={onSubmit} method="get" action="/account/vocabularies" className={css["facets"]}>
			<input type="hidden" name="q" value={searchFilters.q} />
			{/* <input type="hidden" name="order" value={searchFilters.order} /> */}
			<input type="hidden" name="page" value={searchFilters.page} />
			<ConceptStatusFacets />
			<PropertyTypesFacets />
		</form>
	);
}

function ConceptStatusFacets(): ReactNode {
	const t = useTranslations();
	const { searchVocabularies } = useVocabularySearch();
	const filters = useVocabularySearchFilters();
	const searchResults = useVocabularySearchResults();

	const facet = "candidate";
	const name = "f.status";
	const label = t("common.item.status");
	const selectedKeys = filters[name];
	const items = conceptStatus.map((status) => {
		return { id: status, label: t(`authenticated.concepts.concept-status.${status}`) };
	});

	function onChange(keys: Array<string>) {
		searchVocabularies({ ...filters, page: 1, [name]: keys as Array<ConceptStatus> });
	}

	return (
		<div>
			<Facet defaultOpen label={label} name={name} onChange={onChange} value={selectedKeys}>
				{items.map((item) => {
					const count =
						searchResults.data?.facets[facet]?.[mapConceptStatusToFacet(item.id)]?.count;

					return (
						<FacetValue key={item.id} value={item.id}>
							{item.label}
							<span className={css["secondary"]}>{count ?? 0}</span>
						</FacetValue>
					);
				})}
			</Facet>
		</div>
	);
}

function PropertyTypesFacets(): ReactNode {
	const name = "types";

	const t = useTranslations();
	const searchFilters = useVocabularySearchFilters();
	const selectedKeys = searchFilters[name];
	const { searchVocabularies } = useVocabularySearch();
	const searchResults = useVocabularySearchResults();

	if (searchResults.data == null) {
		return null;
	}

	const values = searchResults.data.types;

	if (length(values) === 0) {
		return null;
	}

	const { items, hasMoreItems, all } = getTopFacetValues(values, selectedKeys);

	function onChange(keys: Array<string>) {
		const searchParams = {
			...searchFilters,
			page: 1,
			[name]: keys,
		};

		searchVocabularies(searchParams);
	}

	return (
		<SearchFacetsOverlay
			title={t("authenticated.concepts.property-type.other")}
			hasMoreItems={hasMoreItems}
			renderFacet={(controls) => (
				<Facet
					controls={controls}
					defaultOpen
					label={t("authenticated.concepts.property-type.other")}
					name={name}
					onChange={onChange}
					value={selectedKeys}
				>
					{items.map(([value, { count, label }]) => {
						return (
							<FacetValue key={value} value={value}>
								{label}
								<span className={css["secondary"]}>{count}</span>
							</FacetValue>
						);
					})}
				</Facet>
			)}
		>
			{() => (
				<CheckBoxGroup
					aria-label={t("authenticated.concepts.property-type.other")}
					name={name}
					value={selectedKeys}
					onChange={onChange}
					variant="facet"
				>
					{all.map(([value, { count, label }]) => {
						return (
							<FacetValue key={value} value={value}>
								{label}
								<span className={css["secondary"]}>{count}</span>
							</FacetValue>
						);
					})}
				</CheckBoxGroup>
			)}
		</SearchFacetsOverlay>
	);
}
