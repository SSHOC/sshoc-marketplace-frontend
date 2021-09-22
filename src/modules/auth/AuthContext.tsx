import decode from 'jwt-decode'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'

import { useLocalStorage } from '@/utils/useLocalStorage'

type DecodedToken = {
  sub: string
  iat: number
  exp: number
}

type User = {
  username: string
}

type Session = {
  user: User
  accessToken: string
  expiresAt: number
}

export type Auth = {
  hasCheckedLocalStorage: boolean
  session: Session | null
  signIn: (token: string) => void
  signOut: () => void
  validateToken: (token: string) => DecodedToken | undefined
}

const AuthContext = createContext<Auth | null>(null)

export function useAuth(): Auth {
  const auth = useContext(AuthContext)
  if (auth === null) {
    throw new Error('`useAuth` must be nested inside an `AuthProvider`.')
  }
  return auth
}

/**
 * Stores access token in local storage. Does *not* store additional user data,
 * which should be fetched with `useGetLoggedInUser`.
 */
export default function AuthProvider({
  children,
  onChange,
}: PropsWithChildren<{
  onChange?: () => void
}>): JSX.Element {
  const [
    session,
    setSession,
    hasCheckedLocalStorage,
  ] = useLocalStorage<Session | null>('session', null, onChange)

  const auth = useMemo(() => {
    function signIn(token: string) {
      const decoded = validateToken(token)
      if (decoded === undefined) {
        signOut()
      } else {
        setSession({
          user: { username: decoded.sub },
          accessToken: token,
          expiresAt: decoded.exp,
        })
      }
    }

    function signOut() {
      setSession(null)
    }

    function validateToken(token: string) {
      const decoded = decode(token.slice(7 /* "Bearer " */))
      if (typeof decoded === 'object' && decoded !== null) {
        const decodedToken = decoded as DecodedToken
        /** expiration date is in seconds */
        if (decodedToken.exp * 1000 > Date.now()) return decodedToken
      }
      return undefined
    }

    return {
      hasCheckedLocalStorage,
      session,
      signIn,
      signOut,
      validateToken,
    }
  }, [session, setSession, hasCheckedLocalStorage])

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
