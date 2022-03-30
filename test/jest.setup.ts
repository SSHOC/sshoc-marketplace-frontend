import '@testing-library/jest-dom'

import { setLogger } from 'react-query'
import { TextDecoder, TextEncoder } from 'util'

import { noop } from '@/lib/utils'

/** `jsdom` v16 does not have `TextEncoder`. */
global.TextEncoder = TextEncoder
// @ts-expect-error it's okay (hopefully).
global.TextDecoder = TextDecoder

setLogger({
  /* eslint-disable-next-line no-console */
  log: console.log,
  warn: console.warn,
  /** Stop `react-query` from printing error messages to the console. */
  error: noop,
})
