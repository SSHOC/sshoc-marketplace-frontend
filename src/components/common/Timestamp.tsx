import { useFormatter } from 'next-intl'
import { Fragment } from 'react'

import type { IsoDateString } from '@/lib/core/types'
import { isNonEmptyString } from '@/lib/utils'

export interface TimestampProps {
  dateTime: IsoDateString
  /** @default 'long' */
  dateStyle?: Intl.DateTimeFormatOptions['dateStyle']
  timeStyle?: Intl.DateTimeFormatOptions['timeStyle']
}

export function Timestamp(props: TimestampProps): JSX.Element {
  const { dateTime, dateStyle = 'long', timeStyle } = props

  const format = useFormatter()

  if (!isNonEmptyString(dateTime)) {
    return <Fragment />
  }

  return (
    <time dateTime={dateTime}>{format.dateTime(new Date(dateTime), { dateStyle, timeStyle })}</time>
  )
}
