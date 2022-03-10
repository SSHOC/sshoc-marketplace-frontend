import { rest, setupWorker } from 'msw'

import { handlers as authHandlers } from '@/data/sshoc/mocks/handlers/auth'
import { handlers as itemHandlers } from '@/data/sshoc/mocks/handlers/item'

export const worker = setupWorker(...authHandlers, ...itemHandlers)

/**
 * Make `msw` available globally, so it can be referenced in `cypress`.
 *
 * @see https://mswjs.io/docs/api/setup-worker/use#examples
 */
window.msw = { worker, rest }

declare global {
  interface Window {
    msw: {
      worker: typeof worker
      rest: typeof rest
    }
  }
}
