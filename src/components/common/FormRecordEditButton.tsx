import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'

import type { FormButtonLinkProps } from '@/lib/core/form/FormButtonLink'
import { FormButtonLink } from '@/lib/core/form/FormButtonLink'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import PencilIcon from '@/lib/core/ui/icons/pencil.svg?symbol-icon'

export type FormRecordEditButtonProps = FormButtonLinkProps

export const FormRecordEditButton = forwardRef(function FormRecordEditButton(
  props: FormRecordEditButtonProps,
  forwardeRef: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const { children } = props

  return (
    <FormButtonLink ref={forwardeRef} {...props}>
      <Icon icon={PencilIcon} />
      {children}
    </FormButtonLink>
  )
})
