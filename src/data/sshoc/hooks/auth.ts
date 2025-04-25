import { HttpError } from '@stefanprobst/request'
import type { UseQueryOptions } from 'react-query'
import { useQuery } from 'react-query'

import type { GetCurrentUser } from '@/data/sshoc/api/auth'
import { getCurrentUser } from '@/data/sshoc/api/auth'
import type { AuthData } from '@/data/sshoc/api/common'
import { useSession } from '@/data/sshoc/lib/useSession'
import { useAuth } from '@/lib/core/auth/useAuth'

/** scope */
const authentication = 'authentication'
/** kind */
const user = 'user'

export const keys = {
  all(auth?: AuthData  ) {
    return [authentication, auth ?? null] as const
  },
  user(auth?: AuthData  ) {
    return [authentication, user, auth ?? null] as const
  },
}

export function useCurrentUser<TData = GetCurrentUser.Response>(
  auth?: AuthData  ,
  options?: UseQueryOptions<GetCurrentUser.Response, Error, TData, ReturnType<typeof keys.user>>,
) {
  const { isSignedIn, signOut } = useAuth()
  const session = useSession(auth)
  return useQuery(
    keys.user(session),
    ({ signal }) => {
      return getCurrentUser(session, { signal })
    },
    {
      enabled: isSignedIn,
      ...options,
      onError(error) {
        /**
         * We might have a non-expired token in local storage (that's why we are signed in),
         * but the server may have been restarted. In this case, sign out to clear the stored token.
         */
        if (error instanceof HttpError && error.response.status === 403) {
          signOut()
        }
        options?.onError?.(error)
      },
    },
  )
}
