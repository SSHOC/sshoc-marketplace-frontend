import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  useSignInUser,
  useValidateImplicitGrantTokenWithoutRegistration,
} from '@/api/sshoc/client'
import { Button } from '@/elements/Button/Button'
import { useAuth } from '@/modules/auth/AuthContext'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { Form } from '@/modules/form/Form'
import { isEmail } from '@/modules/form/validate'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Metadata from '@/modules/metadata/Metadata'
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
            className="object-cover object-right-bottom -z-10"
          />
          <div className="relative max-w-xl px-12 py-16 my-12 space-y-6 bg-white rounded-md shadow-md">
            <Title>Sign in</Title>
            <hr className="border-gray-200" />
            <SignInForm />
            <HStack className="space-x-2">
              <SubSectionTitle as="h2">Alternative sign in</SubSectionTitle>
              <div className="flex-1 border-b border-gray-200" />
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
  const signInUser = useSignInUser()

  function onSubmit(formData: SignInFormData) {
    return signInUser.mutateAsync([formData], {
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

  function onValidate(values: Partial<SignInFormData>) {
    const errors: Partial<Record<keyof typeof values, string>> = {}

    if (values.username === undefined) {
      errors.username = 'Username is required.'
    }

    if (values.password === undefined) {
      errors.password = 'Password is required.'
    }

    return errors
  }

  return (
    <Form onSubmit={onSubmit} validate={onValidate}>
      {({ handleSubmit, pristine, submitting, invalid }) => {
        return (
          <VStack as="form" onSubmit={handleSubmit} className="space-y-5">
            <FormTextField name="username" label="Username" />
            <FormTextField name="password" label="Password" type="password" />
            <div className="self-end py-2">
              <Button
                type="submit"
                isDisabled={pristine || invalid || submitting}
                className="w-40 px-6 py-3 transition-colors duration-150 rounded"
              >
                Sign in
              </Button>
            </div>
          </VStack>
        )
      }}
    </Form>
  )
}

function useValidateToken() {
  const router = useRouter()
  const auth = useAuth()
  const {
    status,
    error,
    mutate: validateToken,
  } = useValidateImplicitGrantTokenWithoutRegistration()

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
        className="flex items-center justify-between px-4 text-sm font-medium bg-gray-100 border border-gray-200 rounded text-primary-800 hover:bg-gray-200"
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
