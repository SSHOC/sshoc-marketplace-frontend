import { maxItemSearchFacetValues } from '~/config/sshoc.config'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function getTopFacetValues<T extends { count: number }>(
  values: Record<string, T>,
  additionalKeys?: Array<string>,
) {
  const entries = Object.entries(values)
  const itemsMap = new Map(entries.slice(0, maxItemSearchFacetValues))

  additionalKeys?.forEach((key) => {
    if (!itemsMap.has(key) && key in values) {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      itemsMap.set(key, values[key]!)
    }
  })

  const hasMoreItems = entries.length > itemsMap.size
  const items = Array.from(itemsMap).sort(
    ([label, { count }], [otherLabel, { count: otherCount }]) => {
      return count === otherCount ? label.localeCompare(otherLabel) : count > otherCount ? -1 : 1
    },
  )

  return { items, hasMoreItems, all: entries }
}
