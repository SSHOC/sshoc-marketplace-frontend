export type SafeStringArg = number | string | null | undefined

/**
 * @see https://github.com/vercel/swr/discussions/1247
 */
export function safestring(
  strings: TemplateStringsArray,
  ...args: Array<SafeStringArg>
): string | null {
  let result = strings[0]!
  for (let index = 0; index < args.length; index++) {
    if (args[index] == null) {
      return null
    }
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    result += args[index]! + strings[index + 1]!
  }
  return result
}
