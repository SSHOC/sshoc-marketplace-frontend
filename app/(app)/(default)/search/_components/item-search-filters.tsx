/* eslint-disable react/jsx-no-literals */

"use client";

import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { useFormatter } from "next-intl";
import type { ReactNode } from "react";

import { defaultFacetValuesCount } from "@/app/(app)/(default)/search/_lib/config";
import type { SearchParamsSchema } from "@/app/(app)/(default)/search/_lib/validation";
import { ItemCategoryIcon } from "@/components/item-category-icon";
import { SearchForm } from "@/components/search-form";
import { CheckBox } from "@/components/ui/checkbox";
import { CheckBoxGroup, CheckBoxList } from "@/components/ui/checkbox-group";
import { Label } from "@/components/ui/label";
import type { SearchItems } from "@/lib/api/client";
import { useRouter } from "@/lib/navigation/navigation";

interface ItemSearchFiltersProps {
	categories: SearchItems.Response["categories"];
	facets: SearchItems.Response["facets"];
	searchParams: SearchParamsSchema;
}

export function ItemSearchFilters(props: Readonly<ItemSearchFiltersProps>): ReactNode {
	const { categories, facets, searchParams } = props;

	const format = useFormatter();

	const router = useRouter();

	return (
		<SearchForm action="" className="flex flex-col gap-y-8">
			<CheckBoxGroup
				className="flex flex-col"
				name="categories"
				onChange={(values) => {
					router.push(
						`?${createUrlSearchParams({
							...searchParams,
							categories: values as typeof searchParams.categories,
							page: 1,
						} satisfies SearchParamsSchema)}`,
					);
				}}
				value={searchParams.categories}
			>
				<Label className="px-2 font-medium tracking-wide uppercase" kind="group">
					Categories
				</Label>
				<CheckBoxList>
					{Object.entries(categories).map(([id, { count, label }]) => {
						if (id === "step") {
							return null;
						}

						return (
							<CheckBox
								key={id}
								className="min-w-0 rounded-sm px-2 py-0.5 text-neutral-700 hover:bg-neutral-50 *:data-[slot=label]:inline-flex *:data-[slot=label]:w-full *:data-[slot=label]:min-w-0 *:data-[slot=label]:justify-between *:data-[slot=label]:gap-x-3"
								size="small"
								value={id}
							>
								<span className="inline-flex min-w-0 items-center gap-x-1.5">
									<ItemCategoryIcon
										aria-hidden={true}
										category={id as keyof typeof categories}
										className="size-5 shrink-0"
									/>
									<span className="truncate">{label}</span>
								</span>
								<span className="text-neutral-600">{format.number(count)}</span>
							</CheckBox>
						);
					})}
				</CheckBoxList>
			</CheckBoxGroup>

			<CheckBoxGroup
				className="flex flex-col"
				name="f.activity"
				onChange={(values) => {
					router.push(
						`?${createUrlSearchParams({
							...searchParams,
							"f.activity": values,
							page: 1,
						} satisfies SearchParamsSchema)}`,
					);
				}}
				value={searchParams["f.activity"]}
			>
				<Label className="px-2 font-medium tracking-wide uppercase" kind="group">
					Activities
				</Label>
				<CheckBoxList>
					{Object.entries(facets.activity)
						.slice(0, defaultFacetValuesCount)
						.map(([id, { count }]) => {
							return (
								<CheckBox
									key={id}
									className="min-w-0 rounded-sm px-2 py-0.5 text-neutral-700 hover:bg-neutral-50 *:data-[slot=label]:inline-flex *:data-[slot=label]:w-full *:data-[slot=label]:min-w-0 *:data-[slot=label]:justify-between *:data-[slot=label]:gap-x-3"
									size="small"
									value={id}
								>
									<span className="truncate">{id}</span>
									<span className="text-neutral-600">{format.number(count)}</span>
								</CheckBox>
							);
						})}
				</CheckBoxList>
			</CheckBoxGroup>

			<CheckBoxGroup
				className="flex flex-col"
				name="f.keyword"
				onChange={(values) => {
					router.push(
						`?${createUrlSearchParams({
							...searchParams,
							"f.keyword": values,
							page: 1,
						} satisfies SearchParamsSchema)}`,
					);
				}}
				value={searchParams["f.keyword"]}
			>
				<Label className="px-2 font-medium tracking-wide uppercase" kind="group">
					Keywords
				</Label>
				<CheckBoxList>
					{Object.entries(facets.keyword)
						.slice(0, defaultFacetValuesCount)
						.map(([id, { count }]) => {
							return (
								<CheckBox
									key={id}
									className="min-w-0 rounded-sm px-2 py-0.5 text-neutral-700 hover:bg-neutral-50 *:data-[slot=label]:inline-flex *:data-[slot=label]:w-full *:data-[slot=label]:min-w-0 *:data-[slot=label]:justify-between *:data-[slot=label]:gap-x-3"
									size="small"
									value={id}
								>
									<span className="truncate">{id}</span>
									<span className="text-neutral-600">{format.number(count)}</span>
								</CheckBox>
							);
						})}
				</CheckBoxList>
			</CheckBoxGroup>

			<CheckBoxGroup
				className="flex flex-col"
				name="f.source"
				onChange={(values) => {
					router.push(
						`?${createUrlSearchParams({
							...searchParams,
							"f.source": values,
							page: 1,
						} satisfies SearchParamsSchema)}`,
					);
				}}
				value={searchParams["f.source"]}
			>
				<Label className="px-2 font-medium tracking-wide uppercase" kind="group">
					Sources
				</Label>
				<CheckBoxList>
					{Object.entries(facets.source)
						.slice(0, defaultFacetValuesCount)
						.map(([id, { count }]) => {
							return (
								<CheckBox
									key={id}
									className="min-w-0 rounded-sm px-2 py-0.5 text-neutral-700 hover:bg-neutral-50 *:data-[slot=label]:inline-flex *:data-[slot=label]:w-full *:data-[slot=label]:min-w-0 *:data-[slot=label]:justify-between *:data-[slot=label]:gap-x-3"
									size="small"
									value={id}
								>
									<span className="truncate">{id}</span>
									<span className="text-neutral-600">{format.number(count)}</span>
								</CheckBox>
							);
						})}
				</CheckBoxList>
			</CheckBoxGroup>

			<CheckBoxGroup
				className="flex flex-col"
				name="f.language"
				onChange={(values) => {
					router.push(
						`?${createUrlSearchParams({
							...searchParams,
							"f.language": values,
							page: 1,
						} satisfies SearchParamsSchema)}`,
					);
				}}
				value={searchParams["f.language"]}
			>
				<Label className="px-2 font-medium tracking-wide uppercase" kind="group">
					Languages
				</Label>
				<CheckBoxList>
					{Object.entries(facets.language)
						.slice(0, defaultFacetValuesCount)
						.map(([id, { count }]) => {
							return (
								<CheckBox
									key={id}
									className="min-w-0 rounded-sm px-2 py-0.5 text-neutral-700 hover:bg-neutral-50 *:data-[slot=label]:inline-flex *:data-[slot=label]:w-full *:data-[slot=label]:min-w-0 *:data-[slot=label]:justify-between *:data-[slot=label]:gap-x-3"
									size="small"
									value={id}
								>
									<span className="truncate">{id}</span>
									<span className="text-neutral-600">{format.number(count)}</span>
								</CheckBox>
							);
						})}
				</CheckBoxList>
			</CheckBoxGroup>
		</SearchForm>
	);
}
