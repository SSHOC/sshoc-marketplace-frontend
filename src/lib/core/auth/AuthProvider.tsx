import { HttpError } from '@stefanprobst/request'
import type { JwtPayload } from 'jwt-decode'
import jwtDecode from 'jwt-decode'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation } from 'react-query'

import type { OAuthRegistrationInput, SignInInput, SignUpResponse } from '@/data/sshoc/api/auth'
import {
  authorizeWithEosc,
  signInUser,
  signUpUser,
  validateOAuthToken,
} from '@/data/sshoc/api/auth'
import type { PageComponent } from '@/lib/core/app/types'
import { useTranslations } from 'next-intl'
import { useSearchParams } from '@/lib/core/navigation/useSearchParams'
import type { MutationMetadata } from '@/lib/core/query/types'
import { assert, createSiteUrl, isNonEmptyString } from '@/lib/utils'

type SessionStatus =
  | 'awaitingRegistrationFormData'
  | 'checkingIsRedirect'
  | 'checkingLocalStorage'
  | 'signedIn'
  | 'signedOut'
  | 'unknown'
  | 'validatingBasicAuth'
  | 'validatingIdToken'
  | 'validatingIdTokenAndRequestingRegistrationToken'
  | 'validatingRegistrationFormData'

export interface SessionBase {
  status: SessionStatus
  /** Access token for sshoc backend api. */
  token: string | null
}

export interface SessionSignedIn extends SessionBase {
  status: 'signedIn'
  token: string
}

export interface SessionSignedOut extends SessionBase {
  status: Exclude<SessionStatus, 'signedIn'>
  token: null
}

export type Session = SessionSignedIn | SessionSignedOut

const initialSessionState: Session = { status: 'unknown', token: null }

export interface UseSessionResult {
  session: Session
  signOut: () => void
  signIn: (token: string | null) => void
  updateSessionState: (status: Exclude<SessionStatus, 'signedIn' | 'signedOut'>) => void
}

export interface UseSessionArgs {
  isPageAccessible?: PageComponent['isPageAccessible']
}

export function useSession(args: UseSessionArgs): UseSessionResult {
  const [session, setSession] = useState<Session>(initialSessionState)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isPageAccessible } = args

  const sessionStore = useMemo(() => {
    function signOut() {
      if (isPageAccessible == null || isPageAccessible === true) {
        setSession({ status: 'signedOut', token: null })
      } else {
        router.push('/').then(() => {
          setSession({ status: 'signedOut', token: null })
        })
      }
    }

    function signIn(token: string | null) {
      if (isValidAccessToken(token)) {
        setSession({ status: 'signedIn', token })
        const next = searchParams?.get(nextPageKey)
        if (next != null) {
          router.replace(next)
        } else if ([`/auth/sign-in`, `/auth/sign-up`].includes(router.pathname)) {
          router.replace('/')
        }
      } else {
        signOut()
      }
    }

    function updateSessionState(status: Exclude<SessionStatus, 'signedIn' | 'signedOut'>) {
      setSession({ status, token: null })
    }

    return { session, signOut, signIn, updateSessionState }
  }, [session, router, searchParams, isPageAccessible])

  useEffect(() => {
    if (session.status === 'signedIn') {
      tokenStore.set(session.token)
    } else if (session.status === 'signedOut') {
      tokenStore.delete()
    }
  }, [session])

  return sessionStore
}

export interface AuthService {
  isPageAccessible?: PageComponent['isPageAccessible']
  session: Session
  isInitialising: boolean
  isValidating: boolean
  isSignedIn: boolean
  isSignedOut: boolean
  signInWithBasicAuth: (data: SignInInput) => void
  signInWithOAuth: () => void
  validateRegistrationData: (data: OAuthRegistrationInput) => void
  registrationData: SignUpResponse | undefined
  signOut: () => void
}

export const AuthContext = createContext<AuthService | null>(null)
if (process.env['NODE_ENV'] !== 'production') {
  AuthContext.displayName = 'AuthContext'
}

export interface AuthProviderProps {
  children?: ReactNode
  onSignIn?: () => void
  onSignOut?: () => void
  isPageAccessible?: PageComponent['isPageAccessible']
}

export function AuthProvider(props: AuthProviderProps): JSX.Element {
  const { onSignIn, onSignOut, isPageAccessible } = props

  const t = useTranslations('common')
  const {
    session,
    signOut: _signOut,
    signIn: _signIn,
    updateSessionState,
  } = useSession({ isPageAccessible })
  const router = useRouter()

  // TODO: should be an effect
  const { signOut, signIn } = useMemo(() => {
    function signIn(token: string | null) {
      _signIn(token)
      onSignIn?.()
    }
    function signOut() {
      _signOut()
      onSignOut?.()
    }
    return { signIn, signOut }
  }, [_signOut, _signIn, onSignIn, onSignOut])

  const signInWithBasicAuthMeta: MutationMetadata = {
    messages: {
      mutate() {
        return t(['common', 'auth', 'signing-in'])
      },
      success() {
        return t(['common', 'auth', 'sign-in-success'])
      },
      error() {
        return t(['common', 'auth', 'sign-in-error'])
      },
    },
  }
  const signInWithBasicAuth = useMutation(signInUser, {
    retry: false,
    onMutate() {
      updateSessionState('validatingBasicAuth')
    },
    onSuccess(response) {
      signIn(response.token)
    },
    onError() {
      signOut()
    },
    meta: signInWithBasicAuthMeta,
    useErrorBoundary(error) {
      if (!(error instanceof HttpError)) return true
      return error.response.status >= 500
    },
  })

  const signInWithOAuth = useCallback(function signInWithOAuth() {
    authorizeWithEosc({
      successUrl: redirectUrls.success,
      registrationUrl: redirectUrls.registration,
      errorUrl: redirectUrls.error,
    })
  }, [])

  const validateIdTokenMeta: MutationMetadata = {
    messages: {
      mutate() {
        // return t(['common', 'auth', 'signing-in'])
        // FIXME: never gets updated with success message (at least in firefox), although
        // toast.update is called with the correct toast id.
        return false
      },
      success() {
        return t(['common', 'auth', 'sign-in-success'])
      },
      error() {
        return t(['common', 'auth', 'sign-in-error'])
      },
    },
  }
  const validateIdToken = useMutation(
    function validateIdToken(token: string) {
      return validateOAuthToken({ token, registration: false }).then((data) => {
        assert(data.registration === false)
        return data
      })
    },
    {
      retry: false,
      onMutate() {
        updateSessionState('validatingIdToken')
      },
      onSuccess(response) {
        signIn(response.token)
      },
      onError() {
        signOut()
      },
      meta: validateIdTokenMeta,
      useErrorBoundary(error) {
        if (!(error instanceof HttpError)) return true
        return error.response.status >= 500
      },
    },
  )

  const validateIdTokenAndRequestRegistrationToken = useMutation(
    function validateIdTokenAndRequestRegistrationToken(token: string) {
      return validateOAuthToken({ token, registration: true }).then((data) => {
        assert(data.registration === true)
        return data
      })
    },
    {
      retry: false,
      onMutate() {
        updateSessionState('validatingIdTokenAndRequestingRegistrationToken')
      },
      onSuccess() {
        updateSessionState('awaitingRegistrationFormData')
        // router.push(`/auth/sign-up`)
      },
      onError() {
        signOut()
      },
      meta: {
        messages: {
          mutate() {
            return false
          },
          success() {
            return false
          },
          error() {
            return t(['common', 'auth', 'sign-up-error'])
          },
        },
      },
      useErrorBoundary(error) {
        if (!(error instanceof HttpError)) return true
        return error.response.status >= 500
      },
    },
  )

  const registrationData = validateIdTokenAndRequestRegistrationToken.data

  const validateRegistrationDataMeta: MutationMetadata = {
    messages: {
      mutate() {
        return t(['common', 'auth', 'signing-up'])
      },
      success() {
        return t(['common', 'auth', 'sign-up-success'])
      },
      error() {
        return t(['common', 'auth', 'sign-up-error'])
      },
    },
  }
  const validateRegistrationData = useMutation(
    function validateRegistrationData(data: OAuthRegistrationInput) {
      /** Access token is only valid for registration. */
      // assert(isValidAccessToken(registrationData?.token ?? null))
      assert(registrationData?.token != null)
      return signUpUser({ ...data, token: registrationData.token })
    },
    {
      retry: false,
      onMutate() {
        updateSessionState('validatingRegistrationFormData')
      },
      onSuccess(response) {
        signIn(response.token)
      },
      onError() {
        signOut()
      },
      onSettled() {
        router.replace('/')
      },
      meta: validateRegistrationDataMeta,
      useErrorBoundary(error) {
        if (!(error instanceof HttpError)) return true
        return error.response.status >= 500
      },
    },
  )

  useEffect(() => {
    if (session.status !== 'unknown') return

    updateSessionState('checkingIsRedirect')

    const searchParams = new URLSearchParams(window.location.search)
    const fragment = window.location.hash.slice(1)
    // TODO:
    // const next = searchParams.get(nextPageKey)

    switch (searchParams.get(redirectSearchParamKey)) {
      case redirectSearchParamValues.success: {
        if (isValidIdToken(fragment)) {
          router.replace({ pathname: window.location.pathname })
          validateIdToken.mutate(fragment)
        } else {
          signOut()
        }
        return
      }

      case redirectSearchParamValues.registration: {
        if (isValidIdToken(fragment)) {
          router.replace({ pathname: window.location.pathname })
          validateIdTokenAndRequestRegistrationToken.mutate(fragment)
        } else {
          signOut()
        }
        return
      }

      case redirectSearchParamValues.error: {
        router.replace({ pathname: window.location.pathname })
        signOut()
        return
      }

      default:
        break
    }

    updateSessionState('checkingLocalStorage')

    signIn(tokenStore.get())
  }, [
    router,
    session,
    updateSessionState,
    validateIdToken,
    validateIdTokenAndRequestRegistrationToken,
    signIn,
    signOut,
  ])

  useEffect(() => {
    function registrationCanceled() {
      if (session.status === 'awaitingRegistrationFormData') {
        signOut()
      }
    }

    router.events.on('routeChangeStart', registrationCanceled)

    return () => {
      return router.events.off('routeChangeStart', registrationCanceled)
    }
  }, [session, signOut, router])

  useEffect(() => {
    function onLocalStorageChange(event: StorageEvent) {
      if (event.key === localStorageKey) {
        signIn(event.newValue)
      }
    }

    window.addEventListener('storage', onLocalStorageChange, { passive: true })

    return () => {
      window.removeEventListener('storage', onLocalStorageChange)
    }
  }, [signIn, signOut])

  const authService = useMemo(() => {
    return {
      isPageAccessible,
      session,
      isInitialising: ['unknown', 'checkingIsRedirect', 'checkingLocalStorage'].includes(
        session.status,
      ),
      isValidating: [
        'validatingBasicAuth',
        'validatingIdToken',
        'validatingIdTokenAndRequestingRegistrationToken',
        'validatingRegistrationFormData',
      ].includes(session.status),
      isSignedIn: session.status === 'signedIn',
      isSignedOut: session.status === 'signedOut',
      signInWithBasicAuth: signInWithBasicAuth.mutate,
      signInWithOAuth,
      validateRegistrationData: validateRegistrationData.mutate,
      registrationData,
      signOut,
    }
  }, [
    isPageAccessible,
    session,
    signInWithBasicAuth.mutate,
    signInWithOAuth,
    validateRegistrationData.mutate,
    registrationData,
    signOut,
  ])

  return <AuthContext.Provider value={authService}>{props.children}</AuthContext.Provider>
}

function isValidIdToken(token: string | null): token is string {
  /**
   * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/blob/develop/src/main/java/eu/sshopencloud/marketplace/conf/auth/ImplicitGrantTokenProvider.java#L26
   *
   * Token is valid 30 seconds.
   */
  return isNonEmptyString(token)
}

function isValidAccessToken(token: string | null, prefix = 'Bearer '): token is string {
  if (token == null) return false

  const { exp } = jwtDecode<JwtPayload>(token.slice(prefix.length))

  if (exp != null && exp /** seconds */ * 1000 > Date.now()) {
    return true
  }

  return false
}

const localStorageKey = '__sshoc_token__'

export const tokenStore = {
  get(): string | null {
    return window.localStorage.getItem(localStorageKey)
  },
  set(token: string): void {
    window.localStorage.setItem(localStorageKey, token)
  },
  delete(): void {
    window.localStorage.removeItem(localStorageKey)
  },
}

const redirectSearchParamKey = '__auth__'

const redirectSearchParamValues = {
  success: '__sign-in__',
  registration: '__sign-up__',
  error: '__error__',
}

const redirectUrls = {
  success: createSiteUrl({
    searchParams: { [redirectSearchParamKey]: redirectSearchParamValues.success },
  }),
  registration: createSiteUrl({
    pathname: `/auth/sign-up`,
    searchParams: { [redirectSearchParamKey]: redirectSearchParamValues.registration },
  }),
  error: createSiteUrl({
    searchParams: { [redirectSearchParamKey]: redirectSearchParamValues.error },
  }),
}

export const nextPageKey = '__next__'
