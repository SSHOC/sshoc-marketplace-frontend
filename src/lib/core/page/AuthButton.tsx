import { Fragment } from 'react'

import { NavLinkButton } from '@/components/common/NavLinkButton'
import { useAuth } from '@/lib/core/auth/useAuth'
import { useTranslations } from 'next-intl'
import { AccountMenu } from '@/lib/core/page/AccountMenu'

export function AuthButton(): JSX.Element {
  const t = useTranslations('common')
  const { isSignedIn, isSignedOut } = useAuth()

  if (isSignedIn) {
    return <AccountMenu />
  }

  if (isSignedOut) {
    return (
      <NavLinkButton
        href="/auth/sign-in"
        size="sm"
        style={{
          '--button-padding-inline': 'var(--space-16)',
          '--button-border-radius': '0 0 var(--border-radius-md) var(--border-radius-md)',
        }}
      >
        {t(['common', 'auth', 'sign-in'])}
      </NavLinkButton>
    )
  }

  return <Fragment />
}
