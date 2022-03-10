export function toPositiveInteger(num: unknown): number | null {
  if (typeof num === 'number') {
    if (Number.isInteger(num) && num >= 0) {
      return num
    }
  } else if (typeof num === 'string' && /^\d+$/.test(num)) {
    return Number(num)
  }

  return null
}
