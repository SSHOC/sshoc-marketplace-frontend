import css from "@/components/search/SearchFilters.module.css";
import buttonCss from "@/lib/core/ui/Button/Button.module.css";

import { useButton } from "@react-aria/button";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useTranslations } from "next-intl";
import type { FormEvent, ReactNode } from "react";
import { useRef } from "react";
import { Button as AriaButton, DialogTrigger, Heading } from "react-aria-components";

import { getTopFacetValues } from "@/components/common/getTopFacetValues";
import { ItemCategoryIcon } from "@/components/common/ItemCategoryIcon";
import { ItemSearchDialog } from "@/components/common/ItemSearchDialog";
import { Link } from "@/components/common/Link";
import { SearchFacetsOverlay } from "@/components/common/SearchFacetsOverlay";
import { useSearchItems } from "@/components/common/useSearchItems";
import { ModalDialog } from "@/components/search/ModalDialog";
import type { SearchFilters as ItemSearchFilters } from "@/components/search/useSearchFilters";
import { useSearchFilters } from "@/components/search/useSearchFilters";
import { useSearchResults } from "@/components/search/useSearchResults";
import type { ItemCategory } from "@/data/sshoc/api/item";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { CheckBoxGroup } from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup";
import { CloseButton } from "@/lib/core/ui/CloseButton/CloseButton";
import { Facet, Item as FacetValue } from "@/lib/core/ui/Facet/Facet";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import CrossIcon from "@/lib/core/ui/icons/cross";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";
import { entries, length } from "@/lib/utils";

export function SearchFilters(): ReactNode {
	const t = useTranslations();

	return (
		<aside className={css["container"]} aria-label={t("common.search.search-filters")}>
			<header className={css["section-header"]}>
				<h2 className={css["section-title"]}>{t("common.search.refine-search")}</h2>
				<div className={css["clear-link"]}>
					<Link href="/search">{t("common.search.clear-filters")}</Link>
				</div>
			</header>
			<div className={css["facets-form-container"]}>
				<SearchFacetsForm />
			</div>
			<div className={css["facets-dialog-container"]}>
				<ItemSearchDialog />
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
	const searchFilters = useSearchFilters();

	const activeFilters = [
		searchFilters["categories"],
		searchFilters["f.activity"],
		searchFilters["f.keyword"],
		searchFilters["f.language"],
		searchFilters["f.source"],
	];

	if (
		activeFilters.every((facet) => {
			return facet.length === 0;
		})
	) {
		return null;
	}

	return (
		<section className={css["active-facets"]}>
			<ActiveItemCategoryFacets />
			<ActiveActivityFacets />
			<ActiveKeywordFacets />
			<ActiveSourceFacets />
			<ActiveLanguageFacets />
		</section>
	);
}

interface RemoveFacetValueButtonProps {
	name: Exclude<keyof ItemSearchFilters, "order" | "page" | "perpage" | "q">;
	value: string;
	label: ReactNode;
}

function RemoveFacetValueButton(props: RemoveFacetValueButtonProps): ReactNode {
	const { name, value, label } = props;

	const searchFilters = useSearchFilters();
	const { searchItems } = useSearchItems();
	const ref = useRef<HTMLButtonElement>(null);
	const { buttonProps } = useButton(
		{
			onPress() {
				searchItems({
					...searchFilters,
					[name]: searchFilters[name].filter((v) => {
						return v !== value;
					}),
				});
			},
		},
		ref,
	);

	return (
		<button type="button" {...buttonProps} ref={ref} className={css["remove-facet-value-button"]}>
			<VisuallyHidden>{label}</VisuallyHidden>
			<Icon icon={CrossIcon} />
		</button>
	);
}

function ActiveItemCategoryFacets() {
	const facet = "item-category";
	const name = "categories";

	const t = useTranslations();
	const searchFilters = useSearchFilters();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>{t(`common.facets.${facet}.other`)}</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{values.map((value) => {
					return (
						<li key={value} className={css["active-facet-value"]}>
							{t(`common.item-categories.${value}.other`)}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t("common.search.remove-filter-value", {
									facet: t(`common.facets.${facet}.other`),
									value: t(`common.item-categories.${value}.other`),
								})}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function ActiveActivityFacets() {
	const facet = "activity";
	const name = "f.activity";

	const t = useTranslations();
	const searchFilters = useSearchFilters();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>{t(`common.facets.${facet}.other`)}</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{values.map((value) => {
					return (
						<li key={value} className={css["active-facet-value"]}>
							{value}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t("common.search.remove-filter-value", {
									facet: t(`common.facets.${facet}.other`),
									value,
								})}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function ActiveKeywordFacets() {
	const facet = "keyword";
	const name = "f.keyword";

	const t = useTranslations();
	const searchFilters = useSearchFilters();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>{t(`common.facets.${facet}.other`)}</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{values.map((value) => {
					return (
						<li key={value} className={css["active-facet-value"]}>
							{value}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t("common.search.remove-filter-value", {
									facet: t(`common.facets.${facet}.other`),
									value,
								})}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function ActiveLanguageFacets() {
	const facet = "language";
	const name = "f.language";

	const t = useTranslations();
	const searchFilters = useSearchFilters();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>{t(`common.facets.${facet}.other`)}</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{values.map((value) => {
					return (
						<li key={value} className={css["active-facet-value"]}>
							{value}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t("common.search.remove-filter-value", {
									facet: t(`common.facets.${facet}.other`),
									value,
								})}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function ActiveSourceFacets() {
	const facet = "source";
	const name = "f.source";

	const t = useTranslations();
	const searchFilters = useSearchFilters();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>{t(`common.facets.${facet}.other`)}</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{values.map((value) => {
					return (
						<li key={value} className={css["active-facet-value"]}>
							{value}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t("common.search.remove-filter-value", {
									facet: t(`common.facets.${facet}.other`),
									value,
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
	const searchFilters = useSearchFilters();

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
	}

	return (
		<form onSubmit={onSubmit} method="get" action="/search" className={css["facets"]}>
			<input type="hidden" name="q" value={searchFilters.q} />
			<input type="hidden" name="order" value={searchFilters.order} />
			<input type="hidden" name="page" value={searchFilters.page} />
			<ItemCategoryFacets />
			<ActivityFacets />
			<KeywordFacets />
			<SourceFacets />
			<LanguageFacets />
		</form>
	);
}

function ItemCategoryFacets(): ReactNode {
	const facet = "item-category";
	const name = "categories";

	const t = useTranslations();
	const searchFilters = useSearchFilters();
	const selectedKeys = searchFilters[name];
	const searchResults = useSearchResults();
	const { searchItems } = useSearchItems();

	if (searchResults.data == null) {
		return (
			<Centered>
				<LoadingIndicator />
			</Centered>
		);
	}

	const values = searchResults.data[name];

	if (length(values) === 0) {
		return null;
	}

	const items = entries(values).filter(([category, { count }]) => {
		if (category === "step") {
			return false;
		}
		if (count === 0) {
			return false;
		}
		return true;
	});

	if (items.length === 0) {
		return null;
	}

	function onChange(keys: Array<string>) {
		const searchParams = {
			...searchFilters,
			page: 1,
			[name]: keys as Array<ItemCategory>,
		};

		searchItems(searchParams);
	}

	return (
		<div>
			<Facet
				defaultOpen
				label={t(`common.facets.${facet}.other`)}
				name={name}
				value={selectedKeys}
				onChange={onChange}
			>
				{items.map(([value, { count }]) => {
					return (
						<FacetValue key={value} value={value}>
							<span
								style={{
									display: "grid",
									gap: "6px",
									gridTemplateColumns: "20px 1fr",
									alignItems: "center",
								}}
							>
								<span aria-hidden style={{ aspectRatio: "1" }}>
									<ItemCategoryIcon category={value} />
								</span>
								{t(`common.item-categories.${value}.other`)}
							</span>
							<span className={css["secondary"]}>{count}</span>
						</FacetValue>
					);
				})}
			</Facet>
		</div>
	);
}

function ActivityFacets(): ReactNode {
	const facet = "activity";
	const name = "f.activity";

	const t = useTranslations();
	const searchFilters = useSearchFilters();
	const selectedKeys = searchFilters[name];
	const searchResults = useSearchResults();
	const { searchItems } = useSearchItems();

	if (searchResults.data == null) {
		return null;
	}

	const values = searchResults.data.facets[facet];

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

		searchItems(searchParams);
	}

	return (
		<SearchFacetsOverlay
			title={t(`common.facets.${facet}.other`)}
			hasMoreItems={hasMoreItems}
			renderFacet={(controls) => (
				<Facet
					defaultOpen
					label={t(`common.facets.${facet}.other`)}
					name={name}
					value={selectedKeys}
					onChange={onChange}
					controls={controls}
				>
					{items.map(([value, { count }]) => {
						return (
							<FacetValue key={value} value={value}>
								{value}
								<span className={css["secondary"]}>{count}</span>
							</FacetValue>
						);
					})}
				</Facet>
			)}
		>
			{() => (
				<CheckBoxGroup
					aria-label={t(`common.facets.${facet}.other`)}
					name={name}
					value={selectedKeys}
					onChange={onChange}
					variant="facet"
				>
					{all.map(([value, { count }]) => {
						return (
							<FacetValue key={value} value={value}>
								{value}
								<span className={css["secondary"]}>{count}</span>
							</FacetValue>
						);
					})}
				</CheckBoxGroup>
			)}
		</SearchFacetsOverlay>
	);
}

function KeywordFacets(): ReactNode {
	const facet = "keyword";
	const name = "f.keyword";

	const t = useTranslations();
	const searchFilters = useSearchFilters();
	const selectedKeys = searchFilters[name];
	const searchResults = useSearchResults();
	const { searchItems } = useSearchItems();

	if (searchResults.data == null) {
		return null;
	}

	const values = searchResults.data.facets[facet];

	if (length(values) === 0) {
		return null;
	}

	const { items, hasMoreItems, all } = getTopFacetValues(values, selectedKeys);

	function onChange(keys: Array<string>) {
		const searchParams = {
			...searchFilters,
			page: 1,
			[name]: keys as Array<ItemCategory>,
		};

		searchItems(searchParams);
	}

	return (
		<SearchFacetsOverlay
			title={t(`common.facets.${facet}.other`)}
			hasMoreItems={hasMoreItems}
			renderFacet={(controls) => (
				<Facet
					defaultOpen
					label={t(`common.facets.${facet}.other`)}
					name={name}
					value={selectedKeys}
					onChange={onChange}
					controls={controls}
				>
					{items.map(([value, { count }]) => {
						return (
							<FacetValue key={value} value={value}>
								{value}
								<span className={css["secondary"]}>{count}</span>
							</FacetValue>
						);
					})}
				</Facet>
			)}
		>
			{() => (
				<CheckBoxGroup
					aria-label={t(`common.facets.${facet}.other`)}
					name={name}
					onChange={onChange}
					value={selectedKeys}
					variant="facet"
				>
					{all.map(([value, { count }]) => {
						return (
							<FacetValue key={value} value={value}>
								{value}
								<span className={css["secondary"]}>{count}</span>
							</FacetValue>
						);
					})}
				</CheckBoxGroup>
			)}
		</SearchFacetsOverlay>
	);
}

function LanguageFacets(): ReactNode {
	const facet = "language";
	const name = "f.language";

	const t = useTranslations();
	const searchFilters = useSearchFilters();
	const selectedKeys = searchFilters[name];
	const searchResults = useSearchResults();
	const { searchItems } = useSearchItems();

	if (searchResults.data == null) {
		return null;
	}

	const values = searchResults.data.facets[facet];

	if (length(values) === 0) {
		return null;
	}

	const { items, hasMoreItems, all } = getTopFacetValues(values, selectedKeys);

	function onChange(keys: Array<string>) {
		const searchParams = {
			...searchFilters,
			page: 1,
			[name]: keys as Array<ItemCategory>,
		};

		searchItems(searchParams);
	}

	return (
		<SearchFacetsOverlay
			title={t(`common.facets.${facet}.other`)}
			hasMoreItems={hasMoreItems}
			renderFacet={(controls) => (
				<Facet
					defaultOpen
					label={t(`common.facets.${facet}.other`)}
					name={name}
					value={selectedKeys}
					onChange={onChange}
					controls={controls}
				>
					{items.map(([value, { count }]) => {
						return (
							<FacetValue key={value} value={value}>
								{value}
								<span className={css["secondary"]}>{count}</span>
							</FacetValue>
						);
					})}
				</Facet>
			)}
		>
			{() => (
				<CheckBoxGroup
					aria-label={t(`common.facets.${facet}.other`)}
					name={name}
					value={selectedKeys}
					onChange={onChange}
					variant="facet"
				>
					{all.map(([value, { count }]) => {
						return (
							<FacetValue key={value} value={value}>
								{value}
								<span className={css["secondary"]}>{count}</span>
							</FacetValue>
						);
					})}
				</CheckBoxGroup>
			)}
		</SearchFacetsOverlay>
	);
}

function SourceFacets(): ReactNode {
	const facet = "source";
	const name = "f.source";

	const t = useTranslations();
	const searchFilters = useSearchFilters();
	const selectedKeys = searchFilters[name];
	const searchResults = useSearchResults();
	const { searchItems } = useSearchItems();

	if (searchResults.data == null) {
		return null;
	}

	const values = searchResults.data.facets[facet];

	if (length(values) === 0) {
		return null;
	}

	const { items, hasMoreItems, all } = getTopFacetValues(values, selectedKeys);

	function onChange(keys: Array<string>) {
		const searchParams = {
			...searchFilters,
			page: 1,
			[name]: keys as Array<ItemCategory>,
		};

		searchItems(searchParams);
	}

	return (
		<SearchFacetsOverlay
			title={t(`common.facets.${facet}.other`)}
			hasMoreItems={hasMoreItems}
			renderFacet={(controls) => (
				<Facet
					defaultOpen
					label={t(`common.facets.${facet}.other`)}
					name={name}
					value={selectedKeys}
					onChange={onChange}
					controls={controls}
				>
					{items.map(([value, { count }]) => {
						return (
							<FacetValue key={value} value={value}>
								{value}
								<span className={css["secondary"]}>{count}</span>
							</FacetValue>
						);
					})}
				</Facet>
			)}
		>
			{() => (
				<CheckBoxGroup
					aria-label={t(`common.facets.${facet}.other`)}
					name={name}
					value={selectedKeys}
					onChange={onChange}
					variant="facet"
				>
					{all.map(([value, { count }]) => {
						return (
							<FacetValue key={value} value={value}>
								{value}
								<span className={css["secondary"]}>{count}</span>
							</FacetValue>
						);
					})}
				</CheckBoxGroup>
			)}
		</SearchFacetsOverlay>
	);
}
