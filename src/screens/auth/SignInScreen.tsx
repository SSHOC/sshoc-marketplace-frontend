import cx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useMemo } from 'react'

import { useSignInUser, useValidateImplicitGrantTokenWithoutRegistration } from '@/api/sshoc/client'
import { Button } from '@/elements/Button/Button'
import { toast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { Form } from '@/modules/form/Form'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import VStack from '@/modules/layout/VStack'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'
import styles from '@/screens/auth/SignInScreen.module.css'
import { createUrlFromPath } from '@/utils/createUrlFromPath'
import { getRedirectPath } from '@/utils/getRedirectPath'
import { getScalarQueryParameter } from '@/utils/getScalarQueryParameter'
import { Svg as EoscLogo } from '~/assets/icons/eosc.svg'

/**
 * Sign in screen.
 */
export default function SignInScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex nofollow title="Sign in" />
      <GridLayout className={styles.layout}>
        <ContentColumn className={cx(styles.content, 'xs:px-6 px-2')}>
          <Image
            src={'/assets/images/auth/signin/people@2x.png'}
            alt=""
            loading="lazy"
            layout="fill"
            quality={100}
            className="object-contain object-right-bottom -z-10"
          />
          <div className="relative max-w-1.5xl px-4 xs:px-8 md:px-16 py-8 xs:py-16 mx-auto lg:mx-0 my-6 xs:my-12 space-y-8 bg-white rounded-md shadow-md">
            <Title>Sign in</Title>
            <hr className="border-gray-200" />
            <p>
              Sign in with EOSC using existing accounts such as{' '}
              <span className="font-bold">Google</span>, <span className="font-bold">Dariah</span>,{' '}
              <span className="font-bold">eduTEAMS</span> and multiple academic accounts.
            </p>
            <EoscLoginLink />
            <div className="flex items-baseline space-x-4">
              <span className="text-xl font-bold">or</span>
              <span className="flex-1 border-b border-gray-200" />
            </div>
            <p>Sign in with a local account is used by maintainers to manage the website.</p>
            <SignInForm />
            <div className="flex items-baseline space-x-4">
              {/* <span className="text-xl font-bold">or</span> */}
              <span className="flex-1 border-b border-gray-200" />
            </div>
            <p className="text-gray-550">
              If you are having trouble with the sign in process, please{' '}
              <Link href="/contact">
                <a className="transition-colors text-primary-500 hover:text-primary-750">
                  contact the SSH Open Marketplace team
                </a>
              </Link>
              .
            </p>
          </div>
        </ContentColumn>
      </GridLayout>
      <style jsx global>{`
        body {
          /* Note that we cannot use "transparent" here for the second value, because Safari interprets that as rgba(0, 0, 0, 0), which will produce an awful transition to gray. */
          background: linear-gradient(41deg, #e7f5ff, #e7f5ff00);
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
          router.replace(getRedirectPath(getScalarQueryParameter(router.query.from)) ?? '/')
        }
      },
      onError(error) {
        const message =
          (error instanceof Error && error.message) || 'An unexpected error has occurred.'
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
            <FormTextField name="username" label="Username" isRequired variant="form" size="lg" />
            <FormTextField
              name="password"
              label="Password"
              type="password"
              isRequired
              variant="form"
              size="lg"
            />
            <div className="self-end py-3">
              <Button
                type="submit"
                isDisabled={pristine || invalid || submitting}
                variant="gradient"
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
    /**
     * Hash is base64 encoded token generated by *our* api here:
     * https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/blob/develop/src/main/java/eu/sshopencloud/marketplace/conf/auth/ImplicitGrantTokenProvider.java#L25
     */
    if (hash && hash.length > 0) {
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
            (error instanceof Error && error.message) || 'An unexpected error has occurred.'
          toast.error(message)
        },
      })
      /** remove token fragment from url */
      router.replace({ pathname: url.pathname, query: url.search.slice(1) }, undefined, {
        shallow: true,
      })
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
    const backendBaseUrl = process.env.NEXT_PUBLIC_SSHOC_API_BASE_URL ?? 'http://localhost:8080'
    const frontEndBaseUrl = process.env.NEXT_PUBLIC_SSHOC_BASE_URL ?? 'http://localhost:3000'

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

    eoscAuthLink.searchParams.set('success-redirect-url', String(successRedirectUrl))
    eoscAuthLink.searchParams.set('failure-redirect-url', String(failureRedirectUrl))
    eoscAuthLink.searchParams.set('registration-redirect-url', String(registrationRedirectUrl))

    return String(eoscAuthLink)
  }, [router])

  return (
    <div>
      <a
        className="flex items-center justify-between px-4 space-x-2 text-sm font-medium bg-gray-100 border border-gray-200 rounded shadow text-primary-800 hover:bg-gray-200"
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
