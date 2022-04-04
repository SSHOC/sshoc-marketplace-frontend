import { Fragment, useRef } from 'react'
import { useFieldArray } from 'react-final-form-arrays'

import { FormFieldArray } from '@/components/common/FormFieldArray'
import { FormFieldArrayControls } from '@/components/common/FormFieldArrayControls'
import { FormFieldList } from '@/components/common/FormFieldList'
import { FormFieldListItem } from '@/components/common/FormFieldListItem'
import { FormFieldListItemControls } from '@/components/common/FormFieldListItemControls'
import { FormRecordAddButton } from '@/components/common/FormRecordAddButton'
import { FormRecordRemoveButton } from '@/components/common/FormRecordRemoveButton'
import { MediaUploadForm } from '@/components/item-form/MediaUploadForm'
import { ReviewFieldListItem } from '@/components/item-form/ReviewFieldListItem'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { useSubmitMediaUploadForm } from '@/components/item-form/useSubmitMediaUploadForm'
import type { ItemMediaInput, ItemsDiff } from '@/data/sshoc/api/item'
import { FormThumbnail } from '@/lib/core/form/FormThumbnail'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { ModalDialog } from '@/lib/core/ui/ModalDialog/ModalDialog'
import { useModalDialogTriggerState } from '@/lib/core/ui/ModalDialog/useModalDialogState'
import { useModalDialogTrigger } from '@/lib/core/ui/ModalDialog/useModalDialogTrigger'
import { Thumbnail } from '@/lib/core/ui/Thumbnail/Thumbnail'

export interface ReviewMediaFormFieldArrayProps {
  field: ItemFormFields['fields']['media']
}

export function ReviewMediaFormFieldArray(props: ReviewMediaFormFieldArrayProps): JSX.Element {
  const { field } = props

  const { t } = useI18n<'authenticated' | 'common'>()
  const fieldArray = useFieldArray<ItemMediaInput | UndefinedLeaves<ItemMediaInput>>(field.name, {
    subscription: {},
  })
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
    fieldArray.fields.push(data)
  }

  const onSubmit = useSubmitMediaUploadForm({
    onClose() {
      dialog.close()
    },
    onSuccess(data: ItemMediaInput) {
      onAdd(data)
    },
  })

  return (
    <FormFieldArray>
      <FormFieldList variant="thumbnails">
        {fieldArray.fields.map((name, index) => {
          function onRemove() {
            fieldArray.fields.remove(index)
          }

          const fieldGroup = {
            info: {
              ...field.fields.info,
              name: [name, field.fields.info.name].join('.'),
              _root: [name, field.fields.info._root].join('.'),
            },
            caption: {
              ...field.fields.caption,
              name: [name, field.fields.caption.name].join('.'),
            },
            licence: {
              ...field.fields.licence,
              name: [name, field.fields.licence.name].join('.'),
              _root: [name, field.fields.licence._root].join('.'),
            },
          }

          return (
            <FormFieldListItem key={name}>
              <ReviewFieldListItem<ItemsDiff['item']['media'][number]>
                name={name}
                fields={fieldArray.fields}
                index={index}
                review={({ createLabel, status, value }) => {
                  return (
                    <Thumbnail
                      color={`review ${status}`}
                      // isReadOnly
                      label={createLabel(field.itemLabel)}
                      value={value}
                    />
                  )
                }}
              >
                <Fragment>
                  <FormThumbnail {...field} name={name} label={field.itemLabel} />
                  <FormFieldListItemControls>
                    <FormRecordRemoveButton
                      aria-label={t(['authenticated', 'forms', 'remove-field'], {
                        values: { field: field.itemLabel },
                      })}
                      onPress={onRemove}
                    >
                      {t(['authenticated', 'controls', 'delete'])}
                    </FormRecordRemoveButton>
                  </FormFieldListItemControls>
                </Fragment>
              </ReviewFieldListItem>
            </FormFieldListItem>
          )
        })}
      </FormFieldList>
      <FormFieldArrayControls>
        <FormRecordAddButton ref={triggerRef} {...triggerProps} onPress={onOpenDialog}>
          {t(['authenticated', 'forms', 'add-field'], {
            values: { field: field.itemLabel },
          })}
        </FormRecordAddButton>
        {dialog.isOpen ? (
          <ModalDialog
            {...(overlayProps as any)}
            isDismissable
            isOpen={dialog.isOpen}
            onClose={onCloseDialog}
            title={t(['authenticated', 'media', 'upload-media-dialog-title'])}
          >
            <MediaUploadForm
              fileTypes={['image', 'video']}
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
