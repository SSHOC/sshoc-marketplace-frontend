import { useButton } from "@react-aria/button";
import { useId } from "@react-aria/utils";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useTranslations } from "next-intl";
import type { FormEvent, ReactNode } from "react";
import { Fragment, useRef } from "react";

import css from "@/components/account/ModerateItemSearchFilters.module.css";
import { useModerateItemsSearch } from "@/components/account/useModerateItemsSearch";
import type { SearchFilters } from "@/components/account/useModerateItemsSearchFilters";
import { useModerateItemsSearchFilters } from "@/components/account/useModerateItemsSearchFilters";
import { useModerateItemsSearchResults } from "@/components/account/useModerateItemsSearchResults";
import { getTopFacetValues } from "@/components/common/getTopFacetValues";
import { Link } from "@/components/common/Link";
import { SearchFacetsOverlay } from "@/components/common/SearchFacetsOverlay";
import { ModalDialog } from "@/components/search/ModalDialog";
import { maxItemSearchFacetValues, queryableItemStatus } from "@/config/sshoc.config";
import type { ItemCategory, ItemStatus } from "@/data/sshoc/api/item";
import type { User } from "@/data/sshoc/api/user";
import { useUsersInfinite } from "@/data/sshoc/hooks/user";
import type { CurationFlag } from "@/data/sshoc/utils/curation";
import { curationFlags } from "@/data/sshoc/utils/curation";
import type { IsoDateString } from "@/lib/core/types";
import { Button } from "@/lib/core/ui/Button/Button";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { CheckBox } from "@/lib/core/ui/CheckBox/CheckBox";
import { CheckBoxGroup } from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup";
import { CloseButton } from "@/lib/core/ui/CloseButton/CloseButton";
import { DateField } from "@/lib/core/ui/DateField/DateField";
import { Facet, FacetDisclosure, Item as FacetValue } from "@/lib/core/ui/Facet/Facet";
import { useDisclosure } from "@/lib/core/ui/hooks/useDisclosure";
import { useDisclosureState } from "@/lib/core/ui/hooks/useDisclosureState";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import CrossIcon from "@/lib/core/ui/icons/cross.svg?symbol-icon";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";
import { useModalDialogTriggerState } from "@/lib/core/ui/ModalDialog/useModalDialogState";
import { useModalDialogTrigger } from "@/lib/core/ui/ModalDialog/useModalDialogTrigger";
import { entries, length, mapBy } from "@/lib/utils";

export function ModerateItemSearchFilters(): ReactNode {
	const t = useTranslations();

	return (
		<aside className={css["container"]}>
			<header className={css["section-header"]}>
				<h2 className={css["section-title"]}>{t("common.search.refine-search")}</h2>
				<div className={css["clear-link"]}>
					<Link href="/account/moderate-items">{t("common.search.clear-filters")}</Link>
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
				{t("common.search.refine-search")}
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
							{t("common.search.refine-search")}
						</h2>
						<CloseButton autoFocus onPress={state.close} size="lg" />
					</header>
					<SearchFacetsForm />
				</ModalDialog>
			) : null}
		</Fragment>
	);
}

function ActiveSearchFacets(): ReactNode {
	const searchFilters = useModerateItemsSearchFilters();

	const activeFilters = [searchFilters["d.status"]];

	if (
		activeFilters.every((facet) => {
			return facet.length === 0;
		})
	) {
		return null;
	}

	return (
		<section className={css["active-facets"]}>
			<ActiveCurationFacets />
			<ActiveItemStatusFacets />
			<ActiveItemCategoryFacets />
			<ActiveSourceFacets />
			<ActiveInformationContributorFacets />
			<ActiveOtherFacets />
		</section>
	);
}

interface RemoveFacetValueButtonProps {
	name: Exclude<keyof SearchFilters, "order" | "page" | "perpage" | "q">;
	value: boolean | string;
	label: ReactNode;
}

function RemoveFacetValueButton(props: RemoveFacetValueButtonProps): ReactNode {
	const { name, value, label } = props;

	const searchFilters = useModerateItemsSearchFilters();
	const { searchModerateItems } = useModerateItemsSearch();
	const ref = useRef<HTMLButtonElement>(null);
	const { buttonProps } = useButton(
		{
			onPress() {
				const activeFilters = searchFilters[name];

				if (Array.isArray(activeFilters)) {
					searchModerateItems({
						...searchFilters,
						[name]: activeFilters.filter((v) => {
							return v !== value;
						}),
					});
				} else if (typeof value === "boolean") {
					/**
					 * Usually, value will be a string, and activeFilters an array,
					 * except for `d.deprecated-at-source` and `d.conflict-at-source` which are free-floating boolean flags.
					 */
					searchModerateItems({
						...searchFilters,
						[name]: !value,
					});
				}
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

function ActiveCurationFacets(): ReactNode {
	const name = "d.curation";

	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>{t("authenticated.moderate-items.curation")}</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{values.map((value) => {
					return (
						<li key={value} className={css["active-facet-value"]}>
							{t(`authenticated.curation-flags.${value}`)}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t("common.search.remove-filter-value", {
									facet: t("authenticated.moderate-items.curation-flag.one"),
									value: t(`authenticated.curation-flags.${value}`),
								})}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function ActiveItemStatusFacets(): ReactNode {
	const name = "d.status";

	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();

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
							{t(`common.item-status.${value}`)}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t("common.search.remove-filter-value", {
									facet: t("common.item.status"),
									value: t(`common.item-status.${value}`),
								})}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function ActiveItemCategoryFacets(): ReactNode {
	const facet = "item-category";
	const name = "categories";

	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();

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

function ActiveSourceFacets(): ReactNode {
	const facet = "source";
	const name = "f.source";

	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();

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
									facet: t(`common.facets.${facet}.one`),
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

function ActiveInformationContributorFacets(): ReactNode {
	const name = "d.owner";

	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();

	const values = searchFilters[name];

	if (values.length === 0) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>
				{t("authenticated.moderate-items.information-contributor.other")}
			</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{values.map((value) => {
					return (
						<li key={value} className={css["active-facet-value"]}>
							{value}
							<RemoveFacetValueButton
								name={name}
								value={value}
								label={t("common.search.remove-filter-value", {
									facet: t("authenticated.moderate-items.information-contributor.one"),
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

function ActiveOtherFacets(): ReactNode {
	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();

	const fields = {
		lastInfoUpdate: {
			name: "d.lastInfoUpdate" as const,
			label: t("common.item.last-info-update"),
			value: searchFilters["d.lastInfoUpdate"][0],
		},
		deprecatedAtSource: {
			name: "d.deprecated-at-source" as const,
			label: t("authenticated.moderate-items.deprecated-at-source"),
			value: searchFilters["d.deprecated-at-source"],
		},
		conflictAtSource: {
			name: "d.conflict-at-source" as const,
			label: t("authenticated.moderate-items.conflict-at-source"),
			value: searchFilters["d.conflict-at-source"],
		},
	};

	if (
		fields.lastInfoUpdate.value == null &&
		fields.deprecatedAtSource.value !== true &&
		fields.conflictAtSource.value !== true
	) {
		return null;
	}

	return (
		<div className={css["active-facet"]}>
			<h3 className={css["active-facet-title"]}>
				{t("authenticated.moderate-items.other-facets")}
			</h3>
			<ul role="list" className={css["active-facet-values"]}>
				{fields.lastInfoUpdate.value != null ? (
					<li className={css["active-facet-value"]}>
						{t("common.item.last-updated-on", {
							date: fields.lastInfoUpdate.value,
						})}
						<RemoveFacetValueButton
							name={fields.lastInfoUpdate.name}
							value={fields.lastInfoUpdate.value}
							label={t("common.search.remove-filter-value", {
								facet: t("common.item.last-info-update"),
								value: fields.lastInfoUpdate.value,
							})}
						/>
					</li>
				) : null}
				{fields.deprecatedAtSource.value === true ? (
					<li className={css["active-facet-value"]}>
						{t("authenticated.moderate-items.deprecated-at-source")}
						<RemoveFacetValueButton
							name={fields.deprecatedAtSource.name}
							value={fields.deprecatedAtSource.value}
							label={t("common.search.remove-filter-value", {
								facet: t("authenticated.moderate-items.deprecated-at-source"),
								value: String(fields.deprecatedAtSource.value),
							})}
						/>
					</li>
				) : null}
				{fields.conflictAtSource.value === true ? (
					<li className={css["active-facet-value"]}>
						{t("authenticated.moderate-items.conflict-at-source")}
						<RemoveFacetValueButton
							name={fields.conflictAtSource.name}
							value={fields.conflictAtSource.value}
							label={t("common.search.remove-filter-value", {
								facet: t("authenticated.moderate-items.conflict-at-source"),
								value: String(fields.conflictAtSource.value),
							})}
						/>
					</li>
				) : null}
			</ul>
		</div>
	);
}

function SearchFacetsForm(): ReactNode {
	const searchFilters = useModerateItemsSearchFilters();

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
	}

	return (
		<form
			onSubmit={onSubmit}
			method="get"
			action="/account/moderate-items"
			className={css["facets"]}
		>
			<input type="hidden" name="q" value={searchFilters.q} />
			<input type="hidden" name="order" value={searchFilters.order} />
			<input type="hidden" name="page" value={searchFilters.page} />
			<CurationFacets />
			<ItemStatusFacets />
			<ItemCategoryFacets />
			<SourceFacets />
			<InformationContributorFacets />
			<OtherFacets />
		</form>
	);
}

function CurationFacets(): ReactNode {
	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();
	const { searchModerateItems } = useModerateItemsSearch();

	const name = "d.curation";
	const label = t("authenticated.moderate-items.curation");
	const selectedKeys = searchFilters[name];

	const items = curationFlags.map((flag) => {
		return { id: flag, label: t(`authenticated.curation-flags.${flag}`) };
	});

	function onChange(keys: Array<string>) {
		searchModerateItems({ ...searchFilters, page: 1, [name]: keys as Array<CurationFlag> });
	}

	return (
		<div>
			<Facet defaultOpen label={label} name={name} onChange={onChange} value={selectedKeys}>
				{items.map((item) => {
					return (
						<FacetValue key={item.id} value={item.id}>
							{item.label}
						</FacetValue>
					);
				})}
			</Facet>
		</div>
	);
}

// FIXME: Duplicate in ContributedItemsSearchFilters
function ItemStatusFacets(): ReactNode {
	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();
	const { searchModerateItems } = useModerateItemsSearch();

	const name = "d.status";
	const label = t("common.item.status");
	const selectedKeys = searchFilters[name];

	const items = queryableItemStatus.map((status) => {
		return { id: status, label: t(`common.item-status.${status}`) };
	});

	function onChange(keys: Array<string>) {
		searchModerateItems({ ...searchFilters, page: 1, [name]: keys as Array<ItemStatus> });
	}

	return (
		<div>
			<Facet defaultOpen label={label} name={name} onChange={onChange} value={selectedKeys}>
				{items.map((item) => {
					return (
						<FacetValue key={item.id} value={item.id}>
							{item.label}
						</FacetValue>
					);
				})}
			</Facet>
		</div>
	);
}

// FIXME: Duplicate in SearchFilters
function ItemCategoryFacets(): ReactNode {
	const facet = "item-category";
	const name = "categories";

	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();
	const selectedKeys = searchFilters[name];
	const searchResults = useModerateItemsSearchResults();
	const { searchModerateItems } = useModerateItemsSearch();

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

		searchModerateItems(searchParams);
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
							{t(`common.item-categories.${value}.other`)}
							<span className={css["secondary"]}>{count}</span>
						</FacetValue>
					);
				})}
			</Facet>
		</div>
	);
}

// FIXME: Duplicate in SearchFilters
function SourceFacets(): ReactNode {
	const facet = "source";
	const name = "f.source";

	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();
	const selectedKeys = searchFilters[name];
	const searchResults = useModerateItemsSearchResults();
	const { searchModerateItems } = useModerateItemsSearch();

	const overlay = useDisclosureState({});
	const { contentProps, triggerProps } = useDisclosure(overlay);

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

		searchModerateItems(searchParams);
	}

	if (overlay.isOpen) {
		const items = all;

		return (
			<div>
				<SearchFacetsOverlay
					title={t(`common.facets.${facet}.other`)}
					onClose={overlay.close}
					triggerProps={triggerProps}
				>
					<CheckBoxGroup
						{...(contentProps as any)}
						aria-label={t(`common.facets.${facet}.other`)}
						name={name}
						value={selectedKeys}
						onChange={onChange}
						variant="facet"
					>
						{items.map(([value, { count }]) => {
							return (
								<FacetValue key={value} value={value}>
									{value}
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
			{t("common.search.show-more")}
		</ButtonLink>
	);

	return (
		<div>
			<Facet
				defaultOpen
				label={t(`common.facets.${facet}.other`)}
				name={name}
				value={selectedKeys}
				onChange={onChange}
				controls={hasMoreItems ? controls : undefined}
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
		</div>
	);
}

function InformationContributorFacets(): ReactNode {
	const name = "d.owner";

	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();
	const selectedKeys = searchFilters[name];
	const users = useUsersInfinite({});
	const { searchModerateItems } = useModerateItemsSearch();

	const overlay = useDisclosureState({});
	const { contentProps, triggerProps } = useDisclosure(overlay);

	if (users.data == null) {
		return null;
	}

	const values = users.data.pages.flatMap((page) => {
		return page.users;
	});

	if (length(values) === 0) {
		return null;
	}

	const valuesByUsername = mapBy(values, "username");
	const itemsMap = mapBy(values.slice(0, maxItemSearchFacetValues), "username");
	selectedKeys.forEach((key) => {
		if (!itemsMap.has(key)) {
			/**
			 * We might receive a `username` via search params and not yet have the full list of facet values,
			 * i.e. the page from `getUsers` which includes that username. In that case, let's show the user
			 * username (truncated, because it usually is a long non-human-readable string).
			 */
			itemsMap.set(
				key,
				valuesByUsername.has(key)
					? valuesByUsername.get(key)!
					: ({ displayName: key.slice(0, 12), username: key } as User),
			);
		}
	});
	const total = users.data.pages[0]?.hits ?? 0;
	const all = values;
	const items = Array.from(itemsMap.values());
	const hasMoreItems = total > items.length;

	function onChange(keys: Array<string>) {
		const searchParams = {
			...searchFilters,
			page: 1,
			[name]: keys,
		};

		searchModerateItems(searchParams);
	}

	if (overlay.isOpen) {
		const items = all;

		return (
			<div>
				<SearchFacetsOverlay
					title={t("authenticated.moderate-items.information-contributor.other")}
					onClose={overlay.close}
					triggerProps={triggerProps}
				>
					<CheckBoxGroup
						{...(contentProps as any)}
						aria-label={t("authenticated.moderate-items.information-contributor.other")}
						name={name}
						value={selectedKeys}
						onChange={onChange}
						variant="facet"
					>
						{items.map((user) => {
							return (
								<FacetValue key={user.username} value={user.username}>
									{user.displayName}
								</FacetValue>
							);
						})}
					</CheckBoxGroup>
					{/* FIXME: CheckBoxGroup should be virtualized list, also: make it a react-stately collection component. */}
					{users.hasNextPage === true ? (
						<div className={css["search-facets-overlay-controls"]}>
							<ButtonLink
								onPress={() => {
									users.fetchNextPage();
								}}
							>
								{t("common.search.show-more")}
							</ButtonLink>
						</div>
					) : null}
				</SearchFacetsOverlay>
			</div>
		);
	}

	const controls = (
		<ButtonLink {...(triggerProps as any)} onPress={overlay.toggle}>
			{t("common.search.show-more")}
		</ButtonLink>
	);

	return (
		<div>
			<Facet
				controls={hasMoreItems ? controls : undefined}
				defaultOpen
				label={t("authenticated.moderate-items.information-contributor.other")}
				name={name}
				onChange={onChange}
				value={selectedKeys}
			>
				{items.map((user) => {
					return (
						<FacetValue key={user.username} value={user.username}>
							{user.displayName}
						</FacetValue>
					);
				})}
			</Facet>
		</div>
	);
}

function OtherFacets(): ReactNode {
	const t = useTranslations();
	const searchFilters = useModerateItemsSearchFilters();
	const { searchModerateItems } = useModerateItemsSearch();

	const state = useDisclosureState({ defaultOpen: true });
	const { triggerProps, contentProps } = useDisclosure(state);

	const fields = {
		lastInfoUpdate: {
			name: "d.lastInfoUpdate",
			label: t("common.item.last-info-update"),
			value: searchFilters["d.lastInfoUpdate"][0] ?? "",
			onChange(key: string) {
				searchModerateItems({
					...searchFilters,
					page: 1,
					"d.lastInfoUpdate": (key === "" ? [] : [key]) as Array<IsoDateString>,
				});
			},
		},
		deprecatedAtSource: {
			name: "d.deprecated-at-source",
			label: t("authenticated.moderate-items.deprecated-at-source"),
			value: searchFilters["d.deprecated-at-source"],
			onChange(key: boolean) {
				searchModerateItems({
					...searchFilters,
					page: 1,
					"d.deprecated-at-source": key,
				});
			},
		},
		conflictAtSource: {
			name: "d.conflict-at-source",
			label: t("authenticated.moderate-items.conflict-at-source"),
			value: searchFilters["d.conflict-at-source"],
			onChange(key: boolean) {
				searchModerateItems({
					...searchFilters,
					page: 1,
					"d.conflict-at-source": key,
				});
			},
		},
	};

	return (
		<div>
			<FacetDisclosure
				label={t("authenticated.moderate-items.other-facets")}
				state={state}
				triggerProps={triggerProps}
			>
				<div {...contentProps} className={css["other-facet-values"]}>
					<CheckBox
						name={fields.deprecatedAtSource.name}
						isSelected={fields.deprecatedAtSource.value}
						onChange={fields.deprecatedAtSource.onChange}
					>
						{fields.deprecatedAtSource.label}
					</CheckBox>
					<CheckBox
						name={fields.conflictAtSource.name}
						isSelected={fields.conflictAtSource.value}
						onChange={fields.conflictAtSource.onChange}
					>
						{fields.conflictAtSource.label}
					</CheckBox>
					<DateField
						name={fields.lastInfoUpdate.name}
						label={fields.lastInfoUpdate.label}
						value={fields.lastInfoUpdate.value}
						onChange={fields.lastInfoUpdate.onChange}
					/>
				</div>
			</FacetDisclosure>
		</div>
	);
}
