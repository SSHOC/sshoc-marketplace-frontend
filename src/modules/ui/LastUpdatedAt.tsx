import { formatDate } from '@/utils/formatDate'

export default function LastUpdatedAt({ date }: { date: string }): JSX.Element {
  return (
    <div className="text-sm">
      Last updated at <time dateTime={date}>{formatDate(date)}</time>
    </div>
  )
}
