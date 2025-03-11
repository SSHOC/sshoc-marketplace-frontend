import { useId } from '@react-aria/utils'
import type { FormEvent } from 'react'
import { Fragment, useRef, useState } from 'react'

import css from '@/components/common/ItemSearchDialog.module.css'
import { ItemSearchTermAutocomplete } from '@/components/common/ItemSearchTermAutocomplete'
import { useSearchItems } from '@/components/common/useSearchItems'
import { ModalDialog } from '@/components/search/ModalDialog'
import { useSearchFilters } from '@/components/search/useSearchFilters'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Button } from '@/lib/core/ui/Button/Button'
import { CloseButton } from '@/lib/core/ui/CloseButton/CloseButton'
import { useModalDialogTriggerState } from '@/lib/core/ui/ModalDialog/useModalDialogState'
import { useModalDialogTrigger } from '@/lib/core/ui/ModalDialog/useModalDialogTrigger'
import { isNonEmptyString } from '@/lib/utils'

export function ItemSearchDialog(): JSX.Element {
  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const state = useModalDialogTriggerState({})
  const { triggerProps, overlayProps } = useModalDialogTrigger(
    { type: 'dialog' },
    state,
    triggerRef,
  )
  const titleId = useId()

  return (
    <Fragment>
      <Button
        ref={triggerRef}
        {...triggerProps}
        color="gradient"
        data-dialog="search-term"
        onPress={state.open}
      >
        {t(['common', 'search', 'open-search-dialog'])}
      </Button>
      {state.isOpen ? (
        <ModalDialog
          {...(overlayProps as any)}
          aria-labelledby={titleId}
          isDismissable
          isOpen={state.isOpen}
          onClose={state.close}
        >
          <header className={css['dialog-header']}>
            <h2 className={css['dialog-title']} id={titleId}>
              {t(['common', 'search', 'search-items'])}
            </h2>
            <CloseButton
              aria-label={t(['common', 'search', 'close-search-dialog'])}
              autoFocus
              onPress={state.close}
              size="lg"
            />
          </header>
          <ItemSearchForm
            key={searchFilters.q}
            initialItemSearchTerm={searchFilters.q}
            onClose={state.close}
          />
        </ModalDialog>
      ) : null}
    </Fragment>
  )
}

interface ItemSearchFormProps {
  initialItemSearchTerm?: string
  onClose?: () => void
}

function ItemSearchForm(props: ItemSearchFormProps): JSX.Element {
  const { initialItemSearchTerm, onClose } = props

  const { t } = useI18n<'common'>()
  const { searchItems } = useSearchItems()
  const [itemSearchTerm, setItemSearchTerm] = useState(initialItemSearchTerm ?? '')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const q = isNonEmptyString(itemSearchTerm) ? itemSearchTerm : undefined

    searchItems({ q })

    onClose?.()

    event.preventDefault()
  }

  return (
    <form
      noValidate
      role="search"
      method="get"
      action="/search"
      onSubmit={onSubmit}
      aria-label={t(['common', 'search', 'search-items'])}
      className={css['form-container']}
    >
      <ItemSearchTermAutocomplete
        itemSearchTerm={itemSearchTerm}
        onChangeItemSearchTerm={setItemSearchTerm}
        onSubmit={onClose}
      />
      <Button type="submit" color="gradient">
        {t(['common', 'search', 'submit-search-term'])}
      </Button>
    </form>
  )
}
