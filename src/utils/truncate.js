import { truncate as lodashTruncate } from 'lodash-es'

// TODO: do this ourselves!

export const truncate = (
  text,
  { length = 140, omission = ' …', separator = ' ' } = {}
) =>
  lodashTruncate(text, {
    length,
    omission,
    separator,
  })
