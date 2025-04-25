import { useButton } from "@react-aria/button";
import { useId } from "@react-aria/utils";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import type { FormEvent, ReactNode } from "react";
import { Fragment, useRef } from "react";

import { useVocabularySearch } from "@/components/account/useVocabularySearch";
import type { SearchFilters } from "@/components/account/useVocabularySearchFilters";
import { useVocabularySearchFilters } from "@/components/account/useVocabularySearchFilters";
import { useVocabularySearchResults } from "@/components/account/useVocabularySearchResults";
import css from "@/components/account/VocabularySearchFilters.module.css";
import { getTopFacetValues } from "@/components/common/getTopFacetValues";
import { Link } from "@/components/common/Link";
import { SearchFacetsOverlay } from "@/components/common/SearchFacetsOverlay";
import { ModalDialog } from "@/components/search/ModalDialog";
import type { ConceptStatus } from "@/data/sshoc/utils/concept";
import { conceptStatus, mapConceptStatusToFacet } from "@/data/sshoc/utils/concept";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { Button } from "@/lib/core/ui/Button/Button";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { CheckBoxGroup } from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup";
import { CloseButton } from "@/lib/core/ui/CloseButton/CloseButton";
import { Facet, Item as FacetValue } from "@/lib/core/ui/Facet/Facet";
import { useDisclosure } from "@/lib/core/ui/hooks/useDisclosure";
import { useDisclosureState } from "@/lib/core/ui/hooks/useDisclosureState";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import CrossIcon from "@/lib/core/ui/icons/cross.svg?symbol-icon";
import { useModalDialogTriggerState } from "@/lib/core/ui/ModalDialog/useModalDialogState";
import { useModalDialogTrigger } from "@/lib/core/ui/ModalDialog/useModalDialogTrigger";
import { length } from "@/lib/utils";

export function VocabularySearchFilters(): JSX.Element {
	const { t } = useI18n<"authenticated" | "common">();

	return (
		<aside className={css["container"]}>
			<header className={css["section-header"]}>
				<h2 className={css["section-title"]}>{t(["common", "search", "refine-search"])}</h2>
				<div className={css["clear-link"]}>
					<Link href="/account/vocabularies">{t(["common", "search", "clear-filters"])}</Link>
				</div>
			</header>
			<div className={css["facets-form-container"]}>
				{/* <Suspense
          fallback={
            <Centered>
              <LoadingIndicator />
            </Centered>
          }
        > */}
				<SearchFacetsForm />
				{/* </Suspense> */}
			</div>
			<div className={css["facets-dialog-container"]}>
				<SearchFacetsDialog />
			</div>
		</aside>
	);
}

function SearchFacetsDialog(): JSX.Element {
	const { t } = useI18n<"common">();
	const state = useModalDialogTriggerState({});
	const triggerRef = useRef<HTMLButtonElement>(null);
	const { triggerProps, overlayProps } = useModalDialogTrigger(
		{ type: "dialog" },
		state,
		triggerRef,
	);
	const titleId = useId();

	return (
		<Fragment>
			<Button
				ref={triggerRef}
				{...triggerProps}
				color="gradient"
				data-dialog="facets"
				onPress={state.toggle}
			>
				{t(["common", "search", "refine-search"])}
			</Button>
			<ActiveSearchFacets />
			{state.isOpen ? (
				<ModalDialog
					{...(overlayProps as any)}
					aria-labelledby={titleId}
					isDismissable
					isOpen={state.isOpen}
					onClose={state.close}
				>
					<header className={css["overlay-header"]}>
						<h2 className={css["overlay-title"]} id={titleId}>
							{t(["common", "search", "refine-search"])}
						</h2>
						<CloseButton autoFocus onPress={state.close} size="lg" />
					</header>
					{/* <Suspense
            fallback={
              <Centered>
                <LoadingIndicator />
              </Centered>
            }
          > */}
					<SearchFacetsForm />
					{/* </Suspense> */}
				</ModalDialog>
			) : null}
		</Fragment>
	);
}

function ActiveSearchFacets(): JSX.Element | null {
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

function RemoveFacetValueButton(props: RemoveFacetValueButtonProps): JSX.Element {
	const { name, value, label } = props;

	const searchFilters = useVocabularySearchFilters();
	const { searchVocabularies } = useVocabularySearch();
	const ref = useRef<HTMLButtonElement>(null);
	const { buttonProps } = useButton(
		{
			onPress() {
				searchVocabularies({
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

function ActiveConceptStatusFacets() {
	const name = "f.status";

	const { t } = useI18n<"authenticated" | "common">();
	const searchFilters = useVocabularySearchFilters();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>{t(["common", "item", "status"])}</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{values.map((value) => {
					return (
						<li key={value} className={css["active-facet-value"]}>
							{t(["authenticated", "concepts", "concept-status", value])}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t(["common", "search", "remove-filter-value"], {
									values: {
										facet: t(["authenticated", "concepts", "status"]),
										value: t(["authenticated", "concepts", "concept-status", value]),
									},
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

	const { t } = useI18n<"authenticated" | "common">();
	const searchFilters = useVocabularySearchFilters();
	const searchResults = useVocabularySearchResults();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>
				{t(["authenticated", "concepts", "property-type", "other"])}
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
								label={t(["common", "search", "remove-filter-value"], {
									values: {
										facet: t(["authenticated", "concepts", "property-type", "one"]),
										value: label,
									},
								})}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function SearchFacetsForm(): JSX.Element {
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

function ConceptStatusFacets(): JSX.Element {
	const { t } = useI18n<"authenticated" | "common">();
	const { searchVocabularies } = useVocabularySearch();
	const filters = useVocabularySearchFilters();
	const searchResults = useVocabularySearchResults();

	const facet = "candidate";
	const name = "f.status";
	const label = t(["common", "item", "status"]);
	const selectedKeys = filters[name];
	const items = conceptStatus.map((status) => {
		return { id: status, label: t(["authenticated", "concepts", "concept-status", status]) };
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

function PropertyTypesFacets(): JSX.Element | null {
	const name = "types";

	const { t } = useI18n<"authenticated" | "common">();
	const searchFilters = useVocabularySearchFilters();
	const selectedKeys = searchFilters[name];
	const { searchVocabularies } = useVocabularySearch();
	const searchResults = useVocabularySearchResults();

	const overlay = useDisclosureState({});
	const { contentProps, triggerProps } = useDisclosure(overlay);

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

	if (overlay.isOpen) {
		const items = all;

		return (
			<div>
				<SearchFacetsOverlay
					title={t(["authenticated", "concepts", "property-type", "other"])}
					onClose={overlay.close}
					triggerProps={triggerProps}
				>
					<CheckBoxGroup
						{...(contentProps as any)}
						aria-label={t(["authenticated", "concepts", "property-type", "other"])}
						name={name}
						value={selectedKeys}
						onChange={onChange}
						variant="facet"
					>
						{items.map(([value, { count, label }]) => {
							return (
								<FacetValue key={value} value={value}>
									{label}
									<span className={css["secondary"]}>{count}</span>
								</FacetValue>
							);
						})}
					</CheckBoxGroup>
				</SearchFacetsOverlay>
			</div>
		);
	}

	const controls = (
		<ButtonLink {...(triggerProps as any)} onPress={overlay.toggle}>
			{t(["common", "search", "show-more"])}
		</ButtonLink>
	);

	return (
		<div>
			<Facet
				controls={hasMoreItems ? controls : undefined}
				defaultOpen
				label={t(["authenticated", "concepts", "property-type", "other"])}
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
		</div>
	);
}
