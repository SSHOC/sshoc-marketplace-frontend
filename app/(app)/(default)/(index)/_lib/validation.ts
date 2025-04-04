import * as v from "valibot";

import { itemCategories } from "@/lib/api/client";

export const searchParamsSchema = v.object({
	q: v.fallback(v.string(), ""),
	categories: v.fallback(v.optional(v.picklist([...itemCategories, "all"])), "all"),
});

export type SearchParamsSchema = v.InferOutput<typeof searchParamsSchema>;

export type SearchParamsInputSchema = Partial<v.InferOutput<typeof searchParamsSchema>>;

export async function validateSearchParams(
	searchParams: SearchParams,
): Promise<SearchParamsSchema> {
	return v.parseAsync(searchParamsSchema, searchParams);
}
