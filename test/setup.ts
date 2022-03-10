import '@testing-library/jest-dom'

import { afterAll, afterEach, beforeAll } from '@jest/globals'
// import { loadEnvConfig } from '@next/env'
import { setLogger } from 'react-query'

import { server } from '@/data/sshoc/mocks/server'
import { noop } from '@/lib/utils'

/** Loading `.env` files is handled by `next/jest`. */
// loadEnvConfig(process.cwd(), undefined, { info: noop, error: console.error })

beforeAll(() => {
  if (process.env['NEXT_PUBLIC_API_MOCKING'] === 'enabled') {
    server.listen()
  }
})

afterEach(() => {
  if (process.env['NEXT_PUBLIC_API_MOCKING'] === 'enabled') {
    server.resetHandlers()
  }
})

afterAll(() => {
  if (process.env['NEXT_PUBLIC_API_MOCKING'] === 'enabled') {
    server.close()
  }
})

setLogger({
  /* eslint-disable-next-line no-console */
  log: console.log,
  warn: console.warn,
  /** Stop `react-query` from printing error messages to the console. */
  error: noop,
})
