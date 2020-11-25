import cx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  useSignInUser,
  useValidateImplicitGrantTokenWithoutRegistration,
} from '@/api/sshoc/client'
import { useAuth } from '@/modules/auth/AuthContext'
import FormField from '@/modules/form/FormField'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Metadata from '@/modules/metadata/Metadata'
import TextField from '@/modules/ui/TextField'
import { SubSectionTitle } from '@/modules/ui/typography/SubSectionTitle'
import { Title } from '@/modules/ui/typography/Title'
import { createUrlFromPath } from '@/utils/createUrlFromPath'
import { getRedirectPath } from '@/utils/getRedirectPath'
import { getScalarQueryParameter } from '@/utils/getScalarQueryParameter'
import { Svg as EoscLogo } from '@@/assets/icons/eosc.svg'

/**
 * Sign in screen.
 */
export default function SignInScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex nofollow title="Sign in" />
      <GridLayout style={{ gridTemplateRows: '1fr' }}>
        <ContentColumn style={{ gridColumn: '4 / -2' }}>
          <Image
            src={'/assets/images/auth/signin/people@2x.png'}
            alt=""
            loading="lazy"
            layout="fill"
            quality={100}
            className="-z-10 object-cover object-right-bottom"
          />
          <div className="shadow-md rounded-md max-w-xl px-12 py-16 my-12 bg-white space-y-6 relative">
            <Title>Sign in</Title>
            <hr className="border-gray-200" />
            <SignInForm />
            <HStack className="space-x-2">
              <SubSectionTitle as="h2">Alternative sign in</SubSectionTitle>
              <div className="border-b border-gray-200 flex-1" />
            </HStack>
            <EoscLoginLink />
          </div>
        </ContentColumn>
      </GridLayout>
      <style jsx global>{`
        body {
          background: linear-gradient(41deg, #e7f5ff, transparent);
        }
      `}</style>
    </Fragment>
  )
}

type SignInFormData = {
  username: string
  password: string
}

/**
 * Login form for username/password authentication, and link
 * to kick off OpenID Connect Implicit Grant Flow to autenticate
 * via EGI.
 *
 * This also doubles as the redirect url for OAuth2 in case of failure,
 * and in case of successful auth for users already registered with
 * the marketplace. First-time users authenticating via OAuth2 will be
 * redirected to `/auth/register`.
 *
 * Note that the authentication code from EGI is handled client-side.
 * We cannot do this in `getServerSideProps` since we receive the auth
 * code as a URL fragment.
 */
function SignInForm() {
  const router = useRouter()
  const auth = useAuth()
  useValidateToken()
  const [signInUser] = useSignInUser()
  const { handleSubmit, register, errors, formState } = useForm<SignInFormData>(
    {
      mode: 'onChange',
    },
  )

  function onSubmit(formData: SignInFormData) {
    /** return promise to set formState.isSubmitting correctly */
    return signInUser([formData], {
      onSuccess({ token }) {
        if (token !== null) {
          auth.signIn(token)
          router.replace(
            getRedirectPath(getScalarQueryParameter(router.query.from)) ?? '/',
          )
        }
      },
      onError(error) {
        const message =
          (error instanceof Error && error.message) ||
          'An unexpected error has occurred.'
        toast.error(message)
      },
    })
  }

  const isDisabled = !formState.isValid || formState.isSubmitting

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField label="Username" error={errors.username}>
        <TextField
          name="username"
          aria-invalid={Boolean(errors.username)}
          ref={register({ required: 'Username is required.' })}
        />
      </FormField>
      <FormField label="Password" error={errors.password}>
        <TextField
          name="password"
          type="password"
          aria-invalid={Boolean(errors.password)}
          ref={register({ required: 'Password is required.' })}
        />
      </FormField>
      <div className="self-end py-2">
        <button
          type="submit"
          disabled={isDisabled}
          className={cx(
            'py-3 px-6 w-40 rounded transition-colors duration-150',
            isDisabled
              ? 'pointer-events-none text-gray-500 bg-gray-200'
              : 'text-white bg-primary-800 hover:bg-primary-700',
          )}
        >
          Sign in
        </button>
      </div>
    </VStack>
  )
}

function useValidateToken() {
  const router = useRouter()
  const auth = useAuth()
  const [
    validateToken,
    { status, error },
  ] = useValidateImplicitGrantTokenWithoutRegistration()

  useEffect(() => {
    if (status !== 'idle') return

    const url = createUrlFromPath(router.asPath)
    const { hash, searchParams } = url
    if (hash && hash.length === 69) {
      /** remove leading "#" character */
      const authCode = hash.slice(1)
      validateToken([{ token: authCode, registration: false }], {
        onSuccess({ token }) {
          if (token !== null) {
            auth.signIn(token)
            router.replace(
              getRedirectPath(
                /**
                 * we use `url.searchParams` instead of `router.query.from`,
                 * which is only populated *after* hydration, i.e. in the
                 * second effect run.
                 */
                getScalarQueryParameter(searchParams.get('from') ?? undefined),
              ) ?? '/',
            )
          }
        },
        onError(error) {
          const message =
            (error instanceof Error && error.message) ||
            'An unexpected error has occurred.'
          toast.error(message)
        },
      })
      /** remove token fragment from url */
      router.replace(
        { pathname: url.pathname, query: url.search.slice(1) },
        undefined,
        {
          shallow: true,
        },
      )
    }
  }, [router, auth, validateToken, status])

  return { status, error }
}

/**
 * Sign in with OpenID Connect (OAuth2) Implicit Grant Flow via EOSC.
 */
function EoscLoginLink() {
  const router = useRouter()
  const url = useMemo(() => {
    const backendBaseUrl =
      process.env.NEXT_PUBLIC_SSHOC_API_BASE_URL ?? 'http://localhost:8080'
    const frontEndBaseUrl =
      process.env.NEXT_PUBLIC_SSHOC_BASE_URL ?? 'http://localhost:3000'

    const eoscAuthLink = new URL('/oauth2/authorize/eosc', backendBaseUrl)

    const successRedirectUrl = new URL('/auth/sign-in', frontEndBaseUrl)
    const failureRedirectUrl = new URL('/auth/sign-in', frontEndBaseUrl)
    const registrationRedirectUrl = new URL('/auth/sign-up', frontEndBaseUrl)

    const from = getRedirectPath(getScalarQueryParameter(router.query.from))
    if (from !== undefined) {
      successRedirectUrl.searchParams.set('from', from)
      failureRedirectUrl.searchParams.set('from', from)
      registrationRedirectUrl.searchParams.set('from', from)
    }

    eoscAuthLink.searchParams.set(
      'success-redirect-url',
      String(successRedirectUrl),
    )
    eoscAuthLink.searchParams.set(
      'failure-redirect-url',
      String(failureRedirectUrl),
    )
    eoscAuthLink.searchParams.set(
      'registration-redirect-url',
      String(registrationRedirectUrl),
    )

    return String(eoscAuthLink)
  }, [router])

  return (
    <div>
      <a
        className="flex px-4 rounded border border-gray-200 bg-gray-100 font-medium text-sm text-primary-800 justify-between items-center hover:bg-gray-200"
        href={url}
      >
        <span className="w-10">
          <EoscLogo />
        </span>
        <span className="inline-block py-4">Sign in with EOSC</span>
        <span className="w-10"></span>
      </a>
    </div>
  )
}
