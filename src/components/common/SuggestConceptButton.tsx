import { camelCase } from 'change-case'
import { useTranslations } from 'next-intl'
import { Fragment, useRef } from 'react'

import type { ConceptFormValues } from '@/components/common/ConceptForm'
import { ConceptForm } from '@/components/common/ConceptForm'
import type { PropertyType } from '@/data/sshoc/api/property'
import { useCreateConcept } from '@/data/sshoc/hooks/vocabulary'
import { PASSED_IN_VIA_MUTATION_FUNCTION } from '@/data/sshoc/lib/const'
import type { MutationMetadata } from '@/lib/core/query/types'
import { Button } from '@/lib/core/ui/Button/Button'
import { ButtonLink } from '@/lib/core/ui/Button/ButtonLink'
import { ModalDialog } from '@/lib/core/ui/ModalDialog/ModalDialog'
import { useModalDialogTriggerState } from '@/lib/core/ui/ModalDialog/useModalDialogState'
import { useModalDialogTrigger } from '@/lib/core/ui/ModalDialog/useModalDialogTrigger'

export interface SuggestConceptButtonProps {
  propertyType: PropertyType
  /** @default 'button' */
  variant?: 'button-link' | 'button'
}

export function SuggestConceptButton(props: SuggestConceptButtonProps): JSX.Element {
  const { propertyType, variant = 'button' } = props

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
        return t('concepts.suggest-concept-pending')
      },
      success() {
        return t('concepts.suggest-concept-success')
      },
      error() {
        return t('concepts.suggest-concept-error')
      },
    },
  }
  const createConcept = useCreateConcept(
    { vocabularyCode: PASSED_IN_VIA_MUTATION_FUNCTION, candidate: true },
    undefined,
    { meta },
  )

  function onCreateConcept(values: ConceptFormValues) {
    const { vocabulary, ...concept } = values
    /** Identifier must be provided by the client. */
    const data = { ...concept, code: camelCase(concept.label) }
    dialog.close()
    createConcept.mutate({ vocabularyCode: vocabulary.code, data })
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
          {t('concepts.suggest-concept')}
        </ButtonLink>
      ) : (
        <Button ref={triggerRef} {...triggerProps} color="gradient" onPress={onOpenDialog}>
          {t('concepts.suggest-concept')}
        </Button>
      )}
      {dialog.isOpen ? (
        <ModalDialog
          {...(overlayProps as any)}
          isDismissable
          isOpen={dialog.isOpen}
          onClose={onCloseDialog}
          title={t('concepts.suggest-concept')}
        >
          <ConceptForm
            name="create-concept"
            onCancel={onCloseDialog}
            onSubmit={onCreateConcept}
            propertyType={propertyType}
          />
        </ModalDialog>
      ) : null}
    </Fragment>
  )
}
