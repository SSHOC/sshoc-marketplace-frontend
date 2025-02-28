import { setupWorker } from 'msw'

import { handlers as authHandlers } from '@/data/sshoc/mocks/handlers/auth'
import { handlers as itemHandlers } from '@/data/sshoc/mocks/handlers/item'

export const worker = setupWorker(...authHandlers, ...itemHandlers)
