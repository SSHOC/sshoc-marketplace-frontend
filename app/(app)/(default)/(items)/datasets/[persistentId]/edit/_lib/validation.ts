import * as v from "valibot";

export const searchParamsSchema = v.object({
	initial: v.fallback(v.optional(v.literal("draft"), undefined), undefined),
});

export type SearchParamsSchema = v.InferOutput<typeof searchParamsSchema>;

export async function validateSearchParams(
	searchParams: SearchParams,
): Promise<SearchParamsSchema> {
	return v.parseAsync(searchParamsSchema, searchParams);
}
