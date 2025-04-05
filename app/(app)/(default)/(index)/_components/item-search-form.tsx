"use client";

import { createUrl, createUrlSearchParams, request } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import { type ReactNode, startTransition, useOptimistic, useRef } from "react";
import useQuery from "swr";

import type { SearchParamsSchema } from "@/app/(app)/(default)/(index)/_lib/validation";
import { ItemCategoryIcon } from "@/components/item-category-icon";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { ComboBox, ComboBoxTrigger } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListBox, ListBoxItem } from "@/components/ui/listbox";
import { Popover } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { env } from "@/config/env.config";
import type { AutocompleteItems, ItemCategory } from "@/lib/api/client";
import { useRouter } from "@/lib/navigation/navigation";

interface ItemSearchFormProps {
	categories: Record<string, { id: ItemCategory | "all"; label: string }>;
	searchParams: SearchParamsSchema;
}

export function ItemSearchForm(props: ItemSearchFormProps): ReactNode {
	const { categories, searchParams } = props;

	const t = useTranslations("IndexPage"); // FIXME:

	const router = useRouter();
	const [optimisticSearchParams, setOptimisticSearchParams] = useOptimistic(searchParams);

	function updateSearchParams(searchParams: SearchParamsSchema) {
		startTransition(() => {
			setOptimisticSearchParams(searchParams);
			router.push(`?${createUrlSearchParams(searchParams)}`);
		});
	}

	const { data } = useQuery(["autocomplete-items", optimisticSearchParams], async () => {
		const category =
			optimisticSearchParams.categories !== "all" ? optimisticSearchParams.categories : undefined;
		const q = optimisticSearchParams.q;
		const searchParams = { category, q };

		if (q.length === 0) {
			return { suggestions: [] };
		}

		// return autocompleteItems(searchParams);

		const url = createUrl({
			baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
			pathname: "/api/item-search/autocomplete",
			searchParams: createUrlSearchParams(searchParams),
		});

		return request(url, { responseType: "json" }) as Promise<AutocompleteItems.Response>;
	});

	const formRef = useRef<HTMLFormElement | null>(null);

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
											category={category.id}
											className="size-5 shrink-0"
											data-slot="icon"
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
				className="flex-1"
				inputValue={optimisticSearchParams.q}
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
					<Input type="search" />
				</ComboBoxTrigger>
				<Popover className="w-(--trigger-width)">
					<ListBox>
						{data?.suggestions.map((item) => {
							return (
								<ListBoxItem key={item.persistentId} id={item.persistentId} textValue={item.phrase}>
									{item.phrase}
								</ListBoxItem>
							);
						})}
					</ListBox>
				</Popover>
			</ComboBox>

			{/* TODO: SubmitButton? */}
			<Button kind="gradient" type="submit">
				{t("search-form.submit")}
			</Button>
		</SearchForm>
	);
}
