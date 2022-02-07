/** JSON serializable */
export type JsonSerializable =
  | Array<JsonSerializable>
  | boolean
  | number
  | string
  | { [key: string]: JsonSerializable }
  | null
