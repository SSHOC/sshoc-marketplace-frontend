/** JSON serializable */
export type JSON =
  | null
  | boolean
  | string
  | number
  | Array<JSON>
  | { [key: string]: JSON }
