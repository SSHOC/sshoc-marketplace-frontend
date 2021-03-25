import SignUpScreen from '@/screens/auth/SignUpScreen'

/**
 * Sign up page.
 */
export default function SignUpPage(): JSX.Element | null {
  /* Disable login on production deploy. */
  if (
    process.env.NEXT_PUBLIC_SSHOC_BASE_URL ===
    'https://marketplace.sshopencloud.eu'
  ) {
    return null
  }

  return <SignUpScreen />
}
