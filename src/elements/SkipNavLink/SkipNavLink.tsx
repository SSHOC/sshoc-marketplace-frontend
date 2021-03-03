import { useMessageFormatter } from '@react-aria/i18n'
import type { ReactNode } from 'react'

import dictionary from '@/elements/SkipNavLink/dictionary.json'

export interface SkipNavLinkProps {
  skipToId?: string
  children?: ReactNode
}

/**
 * Navigates to main page content.
 *
 * Allows navigating directly to main page content and skipping navigation menu.
 * Only visible when focused via keyboard.
 */
export function SkipNavLink(props: SkipNavLinkProps): JSX.Element {
  const t = useMessageFormatter(dictionary)

  const skipToId = props.skipToId ?? '#main'
  const label = props.children ?? t('skipToMainContent')

  return (
    <div className="absolute">
      <a
        href={skipToId}
        className="block text-base font-medium bg-white border-2 rounded sr-only focus:not-sr-only border-primary-750 text-primary-750 font-body focus:outline-none"
      >
        <span className="inline-block p-4">{label}</span>
      </a>
    </div>
  )
}
