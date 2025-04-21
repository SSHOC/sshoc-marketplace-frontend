import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { LinkIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import * as v from "valibot";

import { ItemSearchFilters } from "@/app/(app)/(default)/search/_components/item-search-filters";
import { maxItemFacetValues } from "@/app/(app)/(default)/search/_lib/config";
import {
	type SearchParamsSchema,
	searchParamsSchema,
} from "@/app/(app)/(default)/search/_lib/validation";
import { ItemCategoryIcon } from "@/components/item-category-icon";
import { Link } from "@/components/link";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MainContent } from "@/components/ui/main-content";
import { TextInput } from "@/components/ui/text-input";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TouchTarget } from "@/components/ui/touch-target";
import { pluralize, type SearchItems, searchItems } from "@/lib/api/client";
import { toPlaintext } from "@/lib/markdown/to-plaintext";
import { createHref } from "@/lib/navigation/create-href";

interface SearchPageProps {
	searchParams: Promise<SearchParams>;
}

export async function generateMetadata(
	_props: Readonly<SearchPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("SearchPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function SearchPage(props: Readonly<SearchPageProps>): Promise<ReactNode> {
	const { searchParams } = props;

	const t = await getTranslations("SearchPage");
	const format = await getFormatter();

	const validatedSearchParams = await v.parseAsync(searchParamsSchema, await searchParams);

	const searchResults = await searchItems({
		searchParams: {
			...validatedSearchParams,
			order: [validatedSearchParams.order],
		},
	});

	return (
		<MainContent className="relative isolate mx-auto flex w-full max-w-[120rem] flex-col px-8">
			{/* eslint-disable react/jsx-no-literals */}
			<SearchForm action="" className="my-8 flex w-full max-w-[48rem] gap-x-2 self-end">
				<input name="page" type="hidden" value="1" />

				<TextInput className="flex-1" name="q">
					<Label className="sr-only">Search</Label>
					<Input kind="search" size="small" type="search" />
				</TextInput>

				<Button className="min-w-24" kind="gradient" size="small" type="submit">
					Search
				</Button>
			</SearchForm>

			<h1 className="inline-flex items-baseline gap-x-3 text-[2rem] font-medium text-neutral-800">
				{t("title")}
				<span className="text-[1.5rem] font-normal text-neutral-700">
					({format.number(searchResults.hits)})
				</span>
			</h1>

			<div className="grid grid-cols-[18rem_1fr] gap-x-6">
				<aside>
					<ItemSearchFilters
						categories={searchResults.categories}
						facets={searchResults.facets}
						searchParams={validatedSearchParams}
					/>
				</aside>

				<section className="bg-neutral-50">
					{searchResults.hits > 0 ? (
						<ul className="flex flex-col gap-y-1" role="list">
							{searchResults.items.map((item) => {
								return (
									<li key={item.persistentId}>
										<ItemSearchResult item={item} />
									</li>
								);
							})}
						</ul>
					) : (
						<div>Nothing found</div>
					)}
				</section>
			</div>
		</MainContent>
	);
}

interface ItemSearchResultProps {
	item: SearchItems.Response["items"][number];
}

async function ItemSearchResult(props: Readonly<ItemSearchResultProps>): Promise<ReactNode> {
	const { item } = props;

	const t = await getTranslations("IndexPage");

	const { category, description: _description, label, persistentId, properties } = item;
	const description = await toPlaintext(_description);

	const pathname = `/${pluralize.categories(category)}/${persistentId}`;

	const activities = properties
		.filter((property) => {
			return property.type.code === "activity";
		})
		.slice(0, maxItemFacetValues);

	const keywords = properties
		.filter((property) => {
			return property.type.code === "keyword";
		})
		.slice(0, maxItemFacetValues);

	const metadata = [
		{ id: "activity", label: t("facets.activities"), properties: activities },
		{ id: "keyword", label: t("facets.keywords"), properties: keywords },
	];

	return (
		<article className="flex flex-col gap-y-3 px-4 py-8">
			<header className="flex justify-between gap-x-4">
				<h2 className="text-[1.0625rem] leading-[1.25] font-medium text-neutral-800">
					<Link
						className="inline-flex items-center gap-x-4 transition hover:text-brand-750"
						href={createHref({ pathname })}
					>
						<ItemCategoryIcon aria-hidden={true} category={category} className="size-10 shrink-0" />
						{label}
					</Link>
				</h2>

				<TooltipTrigger>
					<IconButton
						className="border border-neutral-250 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-600"
						kind="text"
						label="Copy to clipboard"
						size="small"
					>
						<LinkIcon aria-hidden={true} className="shrink-0" data-slot="icon" />
						<TouchTarget />
					</IconButton>
					<Tooltip>Copy to clipboard</Tooltip>
				</TooltipTrigger>
			</header>

			<dl className="flex flex-col gap-y-1 text-xs">
				{metadata.map(({ id, label, properties }) => {
					if (properties.length === 0) {
						return null;
					}

					return (
						<div key={id} className="flex gap-x-2">
							<dt className="text-neutral-600">{label}</dt>
							<dd className="flex flex-wrap gap-x-1.5 gap-y-1 text-brand-750">
								{properties.map((property) => {
									/**
									 * Both `activity` and `keyword` values should be concepts, i.e. vocabulary-based,
									 * but they are not in the backend's initial development data.
									 */
									const isConcept = property.type.type === "concept";
									const label = isConcept ? property.concept.label : property.value;
									const id = isConcept ? property.concept.code : property.value;

									return (
										<Link
											key={id}
											className="transition hover:text-brand-600"
											href={createHref({
												pathname: "/search",
												searchParams: createUrlSearchParams({
													[`f.${id}`]: [label],
												} satisfies Partial<SearchParamsSchema>),
											})}
										>
											{label}
										</Link>
									);
								})}
							</dd>
						</div>
					);
				})}
			</dl>

			<div className="line-clamp-3 max-w-[56rem] text-base leading-[1.75] text-neutral-700">
				{description}
			</div>

			<Link
				className="self-end text-sm text-brand-750 transition hover:text-brand-600"
				href={createHref({ pathname })}
			>
				Read more
			</Link>
		</article>
	);
}
