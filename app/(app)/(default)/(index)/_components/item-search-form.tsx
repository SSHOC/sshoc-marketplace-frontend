"use client";

import { createUrl, createUrlSearchParams, request } from "@acdh-oeaw/lib";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, startTransition, useRef, useState } from "react";
import useQuery from "swr";

import type { SearchParamsSchema } from "@/app/(app)/(default)/(index)/_lib/validation";
import { ItemCategoryIcon } from "@/components/item-category-icon";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { ComboBox, ComboBoxTrigger } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListBox, ListBoxEmptyState, ListBoxItem } from "@/components/ui/listbox";
import { Popover } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { env } from "@/config/env.config";
import type { AutocompleteItems, ItemCategory } from "@/lib/api/client";

interface ItemSearchFormProps {
	categories: Record<string, { id: ItemCategory | "all"; label: string }>;
	searchParams: SearchParamsSchema;
}

export function ItemSearchForm(props: Readonly<ItemSearchFormProps>): ReactNode {
	const { categories, searchParams } = props;

	const t = useTranslations("IndexPage"); // FIXME:

	const [optimisticSearchParams, setOptimisticSearchParams] = useState(searchParams);

	function updateSearchParams(searchParams: SearchParamsSchema) {
		setOptimisticSearchParams(searchParams);
		window.history.pushState(null, "", `?${createUrlSearchParams(searchParams)}`);
	}

	const { data, isLoading } = useQuery(
		["autocomplete-items", optimisticSearchParams],
		async (): Promise<AutocompleteItems.Response> => {
			const category =
				optimisticSearchParams.categories !== "all" ? optimisticSearchParams.categories : undefined;
			const q = optimisticSearchParams.q;
			const searchParams = { category, q };

			if (q.length === 0) {
				return { phrase: "", suggestions: [] };
			}

			// return autocompleteItems(searchParams);

			const url = createUrl({
				baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
				pathname: "/api/item-search/autocomplete",
				searchParams: createUrlSearchParams(searchParams),
			});

			return request(url, { responseType: "json" }) as Promise<AutocompleteItems.Response>;
		},
	);

	const formRef = useRef<HTMLFormElement | null>(null);

	const suggestions = data?.suggestions ?? [];

	return (
		<SearchForm
			ref={formRef}
			action="/search"
			className="flex items-end gap-1.5 rounded-md border border-neutral-150 bg-neutral-0 p-2.5 shadow sm:px-8"
		>
			<Select
				className="md:min-w-58"
				name="categories"
				onSelectionChange={(value) => {
					updateSearchParams({
						...optimisticSearchParams,
						categories: value as SearchParamsSchema["categories"],
					});
				}}
				selectedKey={optimisticSearchParams.categories}
			>
				<Label className="sr-only">{t("search-form.categories.label")}</Label>
				<SelectTrigger>
					<SelectValue className="flex items-center gap-x-3" />
				</SelectTrigger>
				<Popover className="w-(--trigger-width)">
					<ListBox>
						{Object.entries(categories).map(([key, category]) => {
							return (
								<ListBoxItem key={key} id={category.id} textValue={category.label}>
									{category.id !== "all" ? (
										<ItemCategoryIcon
											aria-hidden={true}
											category={category.id}
											className="size-5 shrink-0"
										/>
									) : (
										// FIXME: should not be visible in SelectValue
										<div className="size-5 shrink-0" />
									)}
									{category.label}
								</ListBoxItem>
							);
						})}
					</ListBox>
				</Popover>
			</Select>

			<ComboBox
				allowsCustomValue={true}
				allowsEmptyCollection={true}
				className="flex-1"
				inputValue={optimisticSearchParams.q}
				items={suggestions}
				name="q"
				onInputChange={(value) => {
					updateSearchParams({
						...optimisticSearchParams,
						q: value,
					});
				}}
				onSelectionChange={() => {
					startTransition(() => {
						requestAnimationFrame(() => {
							formRef.current?.requestSubmit();
						});
					});
				}}
			>
				<Label className="sr-only">{t("search-form.search-input.label")}</Label>
				<ComboBoxTrigger>
					<SearchIcon
						aria-hidden={true}
						className="absolute left-4 size-5 shrink-0 text-neutral-700"
						data-slot="icon"
					/>
					<Input className="pl-12" kind="search" type="search" />
				</ComboBoxTrigger>
				<Popover className="w-(--trigger-width)">
					<ListBox<(typeof suggestions)[number]>
						renderEmptyState={() => {
							return (
								<ListBoxEmptyState>
									{isLoading
										? t("search-form.search-input.loading")
										: t("search-form.search-input.nothing-found")}
								</ListBoxEmptyState>
							);
						}}
					>
						{(item) => {
							return (
								<ListBoxItem key={item.persistentId} id={item.persistentId} textValue={item.phrase}>
									{item.phrase}
								</ListBoxItem>
							);
						}}
					</ListBox>
				</Popover>
			</ComboBox>

			<Button kind="gradient" type="submit">
				{t("search-form.submit")}
			</Button>
		</SearchForm>
	);
}
