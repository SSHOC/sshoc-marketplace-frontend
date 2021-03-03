const emailRegex = new RegExp(
  '^[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*$',
)

export function isEmail(str: string): boolean {
  return emailRegex.test(str)
}

export function isUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}