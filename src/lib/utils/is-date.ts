export function isDate(str: string): boolean {
  return !Number.isNaN(new Date(str).getDate())
}
