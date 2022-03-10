export function groupBy<T extends object, K extends keyof T>(
  items: Array<T>,
  key: K,
): Map<T[K], Array<T>> {
  const map: Map<T[K], Array<T>> = new Map()

  items.forEach((item) => {
    const id = item[key]
    if (map.has(id)) {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      map.get(id)!.push(item)
    } else {
      map.set(id, [item])
    }
  })

  return map
}
