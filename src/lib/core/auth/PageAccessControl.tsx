import type { ReactNode } from 'react'
import { Fragment } from 'react'

import { useCurrentUser } from '@/data/sshoc/hooks/auth'
import { useAccessTokenExpirationTimer } from '@/lib/core/auth/useAccessTokenExpirationTimer'
import { useAuth } from '@/lib/core/auth/useAuth'
import { AuthorizationError } from '@/lib/core/error/AuthorizationError'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export interface PageAccessControlProps {
  children?: ReactNode
}

export function PageAccessControl(props: PageAccessControlProps): JSX.Element {
  const { t } = useI18n<'common'>()
  const { isPageAccessible, isInitialising, isValidating, isSignedIn } = useAuth()
  const currentUser = useCurrentUser()
  useAccessTokenExpirationTimer()

  if (isPageAccessible == null || isPageAccessible === true) {
    return <Fragment>{props.children}</Fragment>
  }

  // TODO: should this just be an overlay, and let the rest of the page already render?
  if (isInitialising || isValidating || currentUser.isLoading) {
    return (
      <FullPage>
        <Centered>
          <LoadingIndicator />
        </Centered>
      </FullPage>
    )
  }

  if (!isSignedIn) {
    throw new AuthorizationError(t(['common', 'default-authorization-error-message']))
  }

  if (typeof isPageAccessible === 'function') {
    if (currentUser.data == null || isPageAccessible(currentUser.data) === false) {
      throw new AuthorizationError(t(['common', 'default-authorization-error-message']))
    }
  }

  return <Fragment>{props.children}</Fragment>
}

// FIXME: extract a useAccessControl hook which can be used in a ProtectedView
