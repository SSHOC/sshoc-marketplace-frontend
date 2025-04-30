import { range } from "@/lib/utils";

export interface UsePaginationArgs {
	/** @default 1 */
	pages?: number;
	/** @default 1 */
	page?: number;
	/** @default 1 */
	boundaryCount?: number;
	/** @default 1 */
	siblingCount?: number;
}

export type UsePaginationResult = Array<{ page: number | "ellipsis"; isCurrent: boolean }>;

/**
 * @see https://github.com/mui-org/material-ui/blob/master/packages/mui-material/src/usePagination/usePagination.js
 */
export function usePagination(options: UsePaginationArgs): UsePaginationResult {
	const { pages = 1, page = 1, boundaryCount = 1, siblingCount = 1 } = options;

	const startPages = range(1, Math.min(boundaryCount, pages));
	const endPages = range(Math.max(pages - boundaryCount + 1, boundaryCount + 1), pages);

	const siblingsStart = Math.max(
		Math.min(page - siblingCount, pages - boundaryCount - siblingCount * 2 - 1),
		boundaryCount + 2,
	);

	const siblingsEnd = Math.min(
		Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),

		endPages.length > 0 ? endPages[0]! - 2 : pages - 1,
	);

	const itemList = [
		...startPages,

		...(siblingsStart > boundaryCount + 2
			? ["ellipsis" as const]
			: boundaryCount + 1 < pages - boundaryCount
				? [boundaryCount + 1]
				: []),

		...range(siblingsStart, siblingsEnd),

		...(siblingsEnd < pages - boundaryCount - 1
			? ["ellipsis" as const]
			: pages - boundaryCount > boundaryCount
				? [pages - boundaryCount]
				: []),

		...endPages,
	];

	const items = itemList.map((item) => {
		return {
			page: item,
			isCurrent: item === page,
		};
	});

	return items;
}
