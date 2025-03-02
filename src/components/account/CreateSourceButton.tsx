import { useTranslations } from 'next-intl'
import { Fragment, useRef } from 'react'

import type { SourceFormValues } from '@/components/account/SourceForm'
import { SourceForm } from '@/components/account/SourceForm'
import { useCreateSource } from '@/data/sshoc/hooks/source'
import type { MutationMetadata } from '@/lib/core/query/types'
import { Button } from '@/lib/core/ui/Button/Button'
import { ButtonLink } from '@/lib/core/ui/Button/ButtonLink'
import { ModalDialog } from '@/lib/core/ui/ModalDialog/ModalDialog'
import { useModalDialogTriggerState } from '@/lib/core/ui/ModalDialog/useModalDialogState'
import { useModalDialogTrigger } from '@/lib/core/ui/ModalDialog/useModalDialogTrigger'

export interface CreateSourceButtonProps {
  /** @default 'button' */
  variant?: 'button-link' | 'button'
}

export function CreateSourceButton(props: CreateSourceButtonProps): JSX.Element {
  const { variant = 'button' } = props

  const dialog = useModalDialogTriggerState({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { triggerProps, overlayProps } = useModalDialogTrigger(
    { type: 'dialog' },
    dialog,
    triggerRef,
  )
  const t = useTranslations('authenticated')
  const meta: MutationMetadata = {
    messages: {
      mutate() {
        return t('sources.create-source-pending')
      },
      success() {
        return t('sources.create-source-success')
      },
      error() {
        return t('sources.create-source-error')
      },
    },
  }
  const createSource = useCreateSource(undefined, { meta })

  function onCreateSource(values: SourceFormValues) {
    dialog.close()
    createSource.mutate({ data: values })
  }

  function onOpenDialog() {
    dialog.open()
  }

  function onCloseDialog() {
    dialog.close()
  }

  return (
    <Fragment>
      {variant === 'button-link' ? (
        <ButtonLink ref={triggerRef} {...triggerProps} onPress={onOpenDialog}>
          {t('sources.create-source')}
        </ButtonLink>
      ) : (
        <Button ref={triggerRef} {...triggerProps} color="gradient" onPress={onOpenDialog}>
          {t('sources.create-source')}
        </Button>
      )}
      {dialog.isOpen ? (
        <ModalDialog
          {...(overlayProps as any)}
          isDismissable
          isOpen={dialog.isOpen}
          onClose={onCloseDialog}
          title={t('sources.create-source')}
        >
          <SourceForm name="create-source" onCancel={onCloseDialog} onSubmit={onCreateSource} />
        </ModalDialog>
      ) : null}
    </Fragment>
  )
}
