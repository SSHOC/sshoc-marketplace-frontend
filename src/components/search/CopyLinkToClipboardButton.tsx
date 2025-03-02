import { useButton } from '@react-aria/button'
import { useObjectRef } from '@react-aria/utils'
import { useTranslations } from 'next-intl'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'

import css from '@/components/search/CopyLinkToClipboardButton.module.css'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import LinkIcon from '@/lib/core/ui/icons/link.svg?symbol-icon'
import { createSiteUrl } from '@/lib/utils'

export interface CopyLinkToClipboardButtonProps {
  href: {
    pathname: string
  }
}

// FIXME: shoud use <Button variant="ghost" /> or similar
export const CopyLinkToClipboardButton = forwardRef(function CopyLinkToClipboardButton(
  props: CopyLinkToClipboardButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const { pathname } = props.href

  const t = useTranslations('common')
  const buttonRef = useObjectRef(forwardedRef)
  const { buttonProps } = useButton(
    {
      onPress() {
        const url = createSiteUrl({ pathname })
        window.navigator.clipboard.writeText(String(url))
      },
    },
    buttonRef,
  )

  const label = t('search.copy-to-clipboard')

  return (
    <button {...buttonProps} className={css['button']} ref={buttonRef}>
      <Icon icon={LinkIcon} aria-label={label} title={label} />
    </button>
  )
})
