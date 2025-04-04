import { ensureArray } from "@acdh-oeaw/lib";
import * as v from "valibot";

import { itemCategories, searchItemsOrders } from "@/lib/api/client";

export const searchParamsSchema = v.object({
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

export type SearchParamsSchema = v.InferOutput<typeof searchParamsSchema>;

export type SearchParamsInputSchema = Partial<v.InferOutput<typeof searchParamsSchema>>;

export async function validateSearchParams(
	searchParams: SearchParams,
): Promise<SearchParamsSchema> {
	return v.parseAsync(searchParamsSchema, searchParams);
}
