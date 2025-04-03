import { ensureArray } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import * as v from "valibot";

import { MainContent } from "@/components/ui/main-content";
import { itemCategories, searchItemsOrders } from "@/lib/api/client";

const SearchParamsSchema = v.object({
	q: v.fallback(v.pipe(v.string()), ""),
	categories: v.fallback(
		v.pipe(v.unknown(), v.transform(ensureArray), v.array(v.picklist(itemCategories))),
		[],
	),
	"f.activity": v.fallback(
		v.pipe(v.unknown(), v.transform(ensureArray), v.array(v.pipe(v.string(), v.nonEmpty()))),
		[],
	),
	"f.keyword": v.fallback(
		v.pipe(v.unknown(), v.transform(ensureArray), v.array(v.pipe(v.string(), v.nonEmpty()))),
		[],
	),
	"f.language": v.fallback(
		v.pipe(v.unknown(), v.transform(ensureArray), v.array(v.pipe(v.string(), v.nonEmpty()))),
		[],
	),
	"f.source": v.fallback(
		v.pipe(v.unknown(), v.transform(ensureArray), v.array(v.pipe(v.string(), v.nonEmpty()))),
		[],
	),
	order: v.fallback(v.picklist(searchItemsOrders), "score"),
	page: v.fallback(
		v.pipe(v.unknown(), v.transform(Number), v.number(), v.integer(), v.minValue(1)),
		1,
	),
});

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

	const validatedSearchParams = await v.parseAsync(SearchParamsSchema, await searchParams);

	return (
		<MainContent>
			<section>
				<h1>{t("title")}</h1>
			</section>

			<pre>{JSON.stringify(validatedSearchParams, null, 2)}</pre>
		</MainContent>
	);
}
