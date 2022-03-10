export type SafeStringArg = number | string | null | undefined

/* eslint-disable @typescript-eslint/no-non-null-assertion */

/**
 * @see https://github.com/vercel/swr/discussions/1247
 */
export function safestring(
  strings: TemplateStringsArray,
  ...args: Array<SafeStringArg>
): string | null {
  let result = strings[0]!
  for (let index = 0; index < args.length; index++) {
    if (args[index] == null) return null
    result += args[index]! + strings[index + 1]!
  }
  return result
}
