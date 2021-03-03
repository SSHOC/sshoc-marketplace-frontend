import SignInScreen from '@/screens/auth/SignInScreen'

/**
 * Sign in page.
 */
export default function SignInPage(): JSX.Element {
  /* Disable login on production deploy. */
  return <SignInScreen />
}
