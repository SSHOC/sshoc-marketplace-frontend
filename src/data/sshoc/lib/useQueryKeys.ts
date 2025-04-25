import type { AuthData } from '@/data/sshoc/api/common'
import type { createQueryKey } from '@/data/sshoc/lib/createQueryKey'
import { useSession } from '@/data/sshoc/lib/useSession'

export function useQueryKeys<T>(keys: T, auth?: AuthData): T {
  const session = useSession(auth)

  const queryKeys = addAuthData(keys, session)

  return queryKeys
}

function addAuthData<T>(keys: T, session: AuthData): T {
   
  const queryKeys = {} as any

  Object.entries(keys).forEach(([key, value]) => {
    if (typeof value === 'function') {
      const createQueryKeyWithAuth: typeof createQueryKey = function createQueryKeyWithAuth(
        scope,
        kind,
        params,
      ) {
        return value(scope, kind, params, session)
      }
      queryKeys[key] = createQueryKeyWithAuth
    } else {
      queryKeys[key] = addAuthData(value, session)
    }
  })

  return queryKeys
}
