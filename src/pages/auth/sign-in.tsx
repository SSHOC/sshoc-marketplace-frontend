import SignInScreen from '@/screens/auth/SignInScreen'

/**
 * Sign in page.
 */
export default function SignInPage(): JSX.Element {
  /* Disable login on production deploy. */
  return process.env.NEXT_PUBLIC_PRODUCTION_DEPLOY !== '1' ? (
    <SignInScreen />
  ) : (
    <div />
  )
}
