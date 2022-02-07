/** JSON serializable */
export type JSON = Array<JSON> | boolean | number | string | { [key: string]: JSON } | null
