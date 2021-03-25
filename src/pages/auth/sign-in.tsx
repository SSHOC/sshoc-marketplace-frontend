import SignInScreen from '@/screens/auth/SignInScreen'

/**
 * Sign in page.
 */
export default function SignInPage(): JSX.Element | null {
  /* Disable login on production deploy. */
  if (
    process.env.NEXT_PUBLIC_SSHOC_BASE_URL ===
    'https://marketplace.sshopencloud.eu'
  ) {
    return null
  }

  return <SignInScreen />
}
