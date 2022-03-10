/**
 * @see https://fettblog.eu/typescript-array-includes/
 */
export function includes<T extends U, U>(arr: ReadonlyArray<T>, item: U): item is T {
  return arr.includes(item as T)
}
