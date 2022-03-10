import { log } from '@/lib/utils'

export async function start(): Promise<void> {
  log.warn('API Mocking enabled')

  if (typeof window === 'undefined') {
    import('@/data/sshoc/mocks/data').then(({ seedDatabase }) => {
      seedDatabase()
    })
    import('@/data/sshoc/mocks/server').then(({ server }) => {
      server.listen()
    })
  } else {
    import('@/data/sshoc/mocks/browser').then(({ worker }) => {
      worker.start()
    })
  }
}
