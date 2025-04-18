"use client";

import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useCallback, useMemo, useRef, useState, useTransition } from "react";

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
import type { ItemCategory } from "@/lib/api/client";
import { debounce } from "@/lib/debounce";
import { useRouter } from "@/lib/navigation/navigation";

interface ItemSearchFormProps {
	categories: Record<string, { id: ItemCategory | "all"; label: string }>;
	searchParams: SearchParamsSchema;
	suggestions: Array<{ persistentId: string; phrase: string }>;
}

export function ItemSearchForm(props: Readonly<ItemSearchFormProps>): ReactNode {
	const { categories, searchParams, suggestions } = props;

	const t = useTranslations("IndexPage"); // FIXME:

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { replace: navigate } = useRouter();
	const [isPending, startTransition] = useTransition();

	/**
	 * This *should* work with `useOptimistic` as well, but currently has glitches
	 * when replaying state updates on the passthrough value, so we use plain `useState`.
	 */
	const [optimisticSearchParams, setOptimisticSearchParams] = useState(searchParams);

	/**
	 * To immediately update url search params, without waiting for the `router.replace` transition
	 * server roundtrip to complete, we could additionally use the html5 history api, which
	 * integrates with `useSearchParams`.
	 */
	const setSearchParams = useCallback(
		(searchParams: SearchParamsSchema) => {
			navigate(`?${createUrlSearchParams(searchParams)}`, { scroll: false });
		},
		[navigate],
	);

	/**
	 * The debounce function needs to return a promise which is pending while the timeout runs,
	 * and only resolves when the callback function resolves. This is because only async functions
	 * can be wrapped with `startTransition` to become actions, which we need to be able to track
	 * the pending state.
	 */
	const debouncedSetSearchParams = useMemo(() => {
		return debounce(setSearchParams, 150);
	}, [setSearchParams]);

	// useEffect(() => {
	// 	return () => {
	// 		debouncedUpdateSearchParams.cancel()
	// 	}
	// }, [debouncedUpdateSearchParams])

	const items = optimisticSearchParams.q.trim().length === 0 ? [] : suggestions;
	const inputValue = isPending ? optimisticSearchParams.q : searchParams.q;

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
					const updatedSearchParams = {
						...optimisticSearchParams,
						categories: value as SearchParamsSchema["categories"],
					};

					setOptimisticSearchParams(updatedSearchParams);

					setSearchParams(updatedSearchParams);
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
				inputValue={inputValue}
				items={items}
				name="q"
				onInputChange={(value) => {
					const updatedSearchParams = {
						...optimisticSearchParams,
						q: value,
					};

					setOptimisticSearchParams(updatedSearchParams);

					startTransition(async () => {
						await debouncedSetSearchParams(updatedSearchParams);
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
									{isPending && inputValue.length > 0
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
