import { useButton } from '@react-aria/button'
import { useObjectRef } from '@react-aria/utils'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'

import css from '@/components/item/CopyLinkToClipboardButton.module.css'
import { useI18n } from '@/lib/core/i18n/useI18n'
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

  const { t } = useI18n<'common'>()
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

  const label = t(['common', 'search', 'copy-to-clipboard'])

  return (
    <button type='button' {...buttonProps} className={css['button']} ref={buttonRef}>
      <Icon icon={LinkIcon} />
      {label}
    </button>
  )
})
