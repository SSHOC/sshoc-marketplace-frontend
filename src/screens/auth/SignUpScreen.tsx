import cx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { useRegisterOAuth2User } from '@/api/sshoc'
import { useValidateImplicitGrantTokenWithRegistration } from '@/api/sshoc/client'
import { useAuth } from '@/modules/auth/AuthContext'
import FormField from '@/modules/hook-form/FormField'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import VStack from '@/modules/layout/VStack'
import Metadata from '@/modules/metadata/Metadata'
import { Anchor } from '@/modules/ui/Anchor'
import Checkbox from '@/modules/ui/Checkbox'
import TextField from '@/modules/ui/TextField'
import { Title } from '@/modules/ui/typography/Title'
import { createUrlFromPath } from '@/utils/createUrlFromPath'
import { getRedirectPath } from '@/utils/getRedirectPath'
import { getScalarQueryParameter } from '@/utils/getScalarQueryParameter'

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
            src={'/assets/images/auth/signup/people@2x.png'}
            alt=""
            loading="lazy"
            layout="fill"
            quality={100}
            className="object-cover object-right-bottom -z-10"
          />
          <div className="relative max-w-xl px-12 py-16 my-12 space-y-6 bg-white rounded-md shadow-md">
            <Title>Sign up</Title>
            <hr className="border-gray-200" />
            <SignUpForm />
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

type SignUpFormData = {
  id: number
  displayName: string
  email: string
  acceptedRegulations: boolean
}

/**
 * Register form for first-time users authenticating with OpenID Connect
 * Implicit Grant Flow via EGI.
 *
 * This also receives the authentication code from EGI. Note that the
 * authentication code is handled client-side. We cannot do this in
 * `getServerSideProps` since we receive the auth code as a URL fragment.
 */
function SignUpForm(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()
  const { data: registrationData } = useValidateAuthCode()
  const { mutate: registerUser } = useRegisterOAuth2User()
  const queryCache = useQueryClient()
  const { register, handleSubmit, errors, reset, formState } = useForm<
    SignUpFormData
  >({ mode: 'onChange' })
  useEffect(() => {
    if (registrationData !== undefined) {
      reset({
        id: registrationData.id,
        displayName: registrationData.displayName,
        email: registrationData.email,
      })
    }
  }, [registrationData, reset])

  function onSubmit(formData: SignUpFormData) {
    if (registrationData === undefined) return
    const { token } = registrationData
    if (token === null) return

    /** return promise to set formState.isSubmitting correctly */
    return registerUser([formData, { token }], {
      onSuccess(userData) {
        auth.signIn(token)
        /**
         * while sign-in endpoints only return a token, the registration
         * endpoint returns full user data.
         */
        queryCache.setQueryData('getLoggedInUser', userData)
        router.replace(
          getRedirectPath(getScalarQueryParameter(router.query.from)) ?? '/',
        )
      },
      onError(error) {
        const message =
          (error instanceof Error && error.message) ||
          'An unexpected error has occurred.'
        toast.error(message)
      },
    })
  }

  const isDisabled =
    registrationData === undefined ||
    registrationData.token === null ||
    !formState.isValid ||
    formState.isSubmitting

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" name="id" ref={register({ required: true })} />
      <VStack className="space-y-6">
        <FormField label="Name" error={errors.displayName}>
          <TextField
            name="displayName"
            aria-invalid={Boolean(errors.displayName)}
            ref={register({ required: 'Name is required.' })}
          />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <TextField
            type="email"
            name="email"
            aria-invalid={Boolean(errors.email)}
            ref={register({ required: 'Email is required.' })}
          />
        </FormField>
        <FormField error={errors.acceptedRegulations}>
          <Checkbox
            name="acceptedRegulations"
            aria-invalid={Boolean(errors.acceptedRegulations)}
            ref={register({
              required: 'Accepting the privacy policy is required.',
            })}
          >
            I have read and understood the{' '}
            <Link href={{ pathname: '/privacy-policy' }} passHref>
              <Anchor>Privacy policy</Anchor>
            </Link>{' '}
            and I accept it.
          </Checkbox>
        </FormField>
        <div className="self-end py-2">
          <button
            type="submit"
            disabled={isDisabled}
            className={cx(
              'py-3 px-6 w-40 transition-colors duration-150 rounded',
              isDisabled
                ? 'bg-gray-200 text-gray-500 pointer-events-none'
                : 'bg-primary-800 text-white',
            )}
          >
            Sign up
          </button>
        </div>
      </VStack>
    </form>
  )
}

function useValidateAuthCode() {
  const router = useRouter()
  const auth = useAuth()
  const {
    data,
    status,
    error,
    mutate: validateToken,
  } = useValidateImplicitGrantTokenWithRegistration()

  useEffect(() => {
    if (status !== 'idle') return

    const url = createUrlFromPath(router.asPath)
    const { hash } = url
    if (hash && hash.length === 69) {
      /** remove leading "#" character */
      const authCode = hash.slice(1)
      /**
       * on successful validation we don't immediately store the access token
       * in auth context, because the user needs to register first.
       * until registration is complete, the user account is disabled
       * in the backend, and the token is only valid for the registration
       * endpoint. any other restricted endpoint will 403 until registration
       * is complete.
       */
      validateToken([{ token: authCode, registration: true }])
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

  return { data, status, error }
}
