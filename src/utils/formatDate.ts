const dateFormatter = Intl.DateTimeFormat('en')

export function formatDate(date: Date | number | string): string {
  return dateFormatter.format(typeof date === 'string' ? new Date(date) : date)
}
