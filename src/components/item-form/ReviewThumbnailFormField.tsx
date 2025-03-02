import { useTranslations } from 'next-intl'
import { Fragment, useRef } from 'react'
import { useForm } from 'react-final-form'

import { FormFieldArray } from '@/components/common/FormFieldArray'
import { FormFieldArrayControls } from '@/components/common/FormFieldArrayControls'
import formFieldListCss from '@/components/common/FormFieldList.module.css'
import formFieldListItemCss from '@/components/common/FormFieldListItem.module.css'
import { FormFieldListItemControls } from '@/components/common/FormFieldListItemControls'
import { FormRecordAddButton } from '@/components/common/FormRecordAddButton'
import { FormRecordRemoveButton } from '@/components/common/FormRecordRemoveButton'
import { MediaUploadForm } from '@/components/item-form/MediaUploadForm'
import { ReviewField } from '@/components/item-form/ReviewField'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { useSubmitMediaUploadForm } from '@/components/item-form/useSubmitMediaUploadForm'
import type { ItemMediaInput, ItemsDiff } from '@/data/sshoc/api/item'
import { FormThumbnail } from '@/lib/core/form/FormThumbnail'
import { useFieldState } from '@/lib/core/form/useFieldState'
import { ModalDialog } from '@/lib/core/ui/ModalDialog/ModalDialog'
import { useModalDialogTriggerState } from '@/lib/core/ui/ModalDialog/useModalDialogState'
import { useModalDialogTrigger } from '@/lib/core/ui/ModalDialog/useModalDialogTrigger'
import { Thumbnail } from '@/lib/core/ui/Thumbnail/Thumbnail'

export interface ReviewThumbnailFormFieldProps {
  field: ItemFormFields['fields']['thumbnail']
}

export function ReviewThumbnailFormField(props: ReviewThumbnailFormFieldProps): JSX.Element {
  const { field } = props

  const t = useTranslations('authenticated')
  const form = useForm()
  const dialog = useModalDialogTriggerState({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { triggerProps, overlayProps } = useModalDialogTrigger(
    { type: 'dialog' },
    dialog,
    triggerRef,
  )

  function onCloseDialog() {
    dialog.close()
  }

  function onOpenDialog() {
    dialog.open()
  }

  function onAdd(data: ItemMediaInput) {
    form.change(field.name, data)
  }

  const onSubmit = useSubmitMediaUploadForm({
    onClose() {
      dialog.close()
    },
    onSuccess(data: ItemMediaInput) {
      onAdd(data)
    },
  })

  function onRemove() {
    form.change(field.name, undefined)
  }

  const thumbnail = useFieldState<ItemMediaInput | undefined>(field.name).input.value

  return (
    <FormFieldArray>
      <div className={formFieldListCss['list']} data-variant="thumbnails">
        <div className={formFieldListItemCss['list-item']}>
          <ReviewField<ItemsDiff['item']['thumbnail']>
            name={field.name}
            review={({ createLabel, status, value }) => {
              return (
                <Thumbnail
                  color={`review ${status}`}
                  // isReadOnly
                  label={createLabel(field.label)}
                  value={value}
                />
              )
            }}
          >
            <Fragment>
              <FormThumbnail {...field} />
              <FormFieldListItemControls>
                {thumbnail != null ? (
                  <FormRecordRemoveButton
                    aria-label={t('forms.remove-field', {
                      field: field.label,
                    })}
                    onPress={onRemove}
                  >
                    {t('controls.delete')}
                  </FormRecordRemoveButton>
                ) : null}
              </FormFieldListItemControls>
            </Fragment>
          </ReviewField>
        </div>
      </div>
      <FormFieldArrayControls>
        <FormRecordAddButton ref={triggerRef} {...triggerProps} onPress={onOpenDialog}>
          {t('forms.add-field', {
            field: field.label,
          })}
        </FormRecordAddButton>
        {dialog.isOpen ? (
          <ModalDialog
            {...(overlayProps as any)}
            isDismissable
            isOpen={dialog.isOpen}
            onClose={onCloseDialog}
            title={t('media.upload-media-dialog-title')}
          >
            <MediaUploadForm
              fileTypes={['image']}
              name="upload-media"
              onCancel={onCloseDialog}
              onSubmit={onSubmit}
            />
          </ModalDialog>
        ) : null}
      </FormFieldArrayControls>
    </FormFieldArray>
  )
}
