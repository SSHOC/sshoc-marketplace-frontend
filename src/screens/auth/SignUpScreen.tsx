import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useEffect } from 'react'
import { useQueryClient } from 'react-query'

import { useRegisterOAuth2User } from '@/api/sshoc'
import { useValidateImplicitGrantTokenWithRegistration } from '@/api/sshoc/client'
import { Button } from '@/elements/Button/Button'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import { FormCheckBox } from '@/modules/form/components/FormCheckBox/FormCheckBox'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { Form } from '@/modules/form/Form'
import { FormField } from '@/modules/form/FormField'
import { isEmail } from '@/modules/form/validate'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import VStack from '@/modules/layout/VStack'
import Metadata from '@/modules/metadata/Metadata'
import { Anchor } from '@/modules/ui/Anchor'
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
            className="object-contain object-right-bottom -z-10"
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
  const registration = useValidateAuthCode()
  const registerUser = useRegisterOAuth2User()
  const queryCache = useQueryClient()

  function onSubmit(formData: SignUpFormData) {
    if (registration.data === undefined) return
    const { token } = registration.data
    if (token === null) return

    return registerUser.mutateAsync([formData, { token }], {
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

  function onValidate(values: Partial<SignUpFormData>) {
    const errors: Partial<Record<keyof typeof values, string>> = {}

    if (values.displayName === undefined) {
      errors.displayName = 'Display name is required.'
    }

    if (values.email === undefined) {
      errors.email = 'Email is required.'
    } else if (!isEmail(values.email)) {
      errors.email = 'Please enter a valid email address.'
    }

    if (values.acceptedRegulations !== true) {
      errors.acceptedRegulations = 'Accepting the privacy policy is required.'
    }

    return errors
  }

  if (registration.status !== 'success' || registration.data === undefined) {
    return (
      <div className="flex flex-col items-center justify-center">
        <ProgressSpinner />
      </div>
    )
  }

  const initialValues = {
    id: registration.data.id,
    displayName: registration.data.displayName,
    email: registration.data.email,
  }

  return (
    <Form
      onSubmit={onSubmit}
      validate={onValidate}
      initialValues={initialValues}
    >
      {({ handleSubmit, pristine, submitting, invalid }) => {
        return (
          <form onSubmit={handleSubmit}>
            <FormField type="hidden" name="id" component="input" />
            <VStack className="space-y-6">
              <FormTextField name="displayName" label="Name" />
              <FormTextField type="email" name="email" label="Email" />
              <FormCheckBox name="acceptedRegulations">
                <span>I have read and understood the </span>
                <Anchor
                  href={new URL(
                    '/privacy-policy',
                    process.env.NEXT_PUBLIC_SSHOC_BASE_URL,
                  ).toString()}
                  target="_blank"
                >
                  Privacy policy
                </Anchor>
                <span> and I accept it.</span>
              </FormCheckBox>
              <div className="self-end py-2">
                <Button
                  type="submit"
                  isDisabled={
                    registration.data === undefined ||
                    registration.data.token === null ||
                    pristine ||
                    submitting ||
                    invalid
                  }
                  className="w-40 px-6 py-3 transition-colors duration-150 rounded"
                >
                  Sign up
                </Button>
              </div>
            </VStack>
          </form>
        )
      }}
    </Form>
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
    /**
     * The develop egi instance uses 68+1 chars, the demo instance (which is used on staging)
     * uses 64+1 chars.
     */
    if (hash && (hash.length === 69 || hash.length === 65)) {
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
    } else {
      toast.error('Received invalid token.')
      router.replace({ pathname: '/auth/sign-in' })
    }
  }, [router, auth, validateToken, status])

  return { data, status, error }
}
