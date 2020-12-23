/**
 * Returns props for pagination links.
 *
 * @see https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/usePagination/usePagination.js
 */
export default function usePagination({
  count = 1,
  page = 1,
  boundaryCount = 1,
  siblingCount = 1,
}: {
  count?: number
  page?: number
  boundaryCount?: number
  siblingCount?: number
}): Array<{ page: number | 'ellipsis'; isCurrent: boolean }> {
  function range(start: number, end: number) {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  )

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  )

  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  )

  const itemList = [
    ...startPages,

    ...(siblingsStart > boundaryCount + 2
      ? ['ellipsis' as const]
      : boundaryCount + 1 < count - boundaryCount
      ? [boundaryCount + 1]
      : []),

    ...range(siblingsStart, siblingsEnd),

    ...(siblingsEnd < count - boundaryCount - 1
      ? ['ellipsis' as const]
      : count - boundaryCount > boundaryCount
      ? [count - boundaryCount]
      : []),

    ...endPages,
  ]

  const items = itemList.map((item) => {
    return {
      page: item,
      isCurrent: item === page,
    }
  })

  return items
}
