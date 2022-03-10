const emailRegex = new RegExp(
  '^[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*$',
)

export function isEmail(str: string): boolean {
  return emailRegex.test(str)
}
