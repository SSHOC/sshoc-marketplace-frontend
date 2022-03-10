import css from '@/components/item-form/ReviewControls.module.css'
import type { DiffFieldMetadata } from '@/components/item-form/useItemDiffFormFieldsMetadata'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Button } from '@/lib/core/ui/Button/Button'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import CheckMarkIcon from '@/lib/core/ui/icons/checkmark.svg?symbol-icon'
import CrossIcon from '@/lib/core/ui/icons/cross.svg?symbol-icon'

export interface ReviewControlsProps {
  metadata: DiffFieldMetadata['diff']
  onApprove: () => void
  onReject: () => void
}

export function ReviewControls(props: ReviewControlsProps): JSX.Element {
  const { metadata, onApprove, onReject } = props

  const { t } = useI18n<'authenticated' | 'common'>()

  return (
    <div className={css['container']}>
      <span className={css['status']}>
        {t(['authenticated', 'review', 'status', metadata.status])}
      </span>
      <div className={css['approve-button']}>
        <Button color="positive" onPress={onApprove} size="sm" variant="border">
          <Icon icon={CheckMarkIcon} />
          {t(['authenticated', 'controls', 'approve'])}
        </Button>
      </div>
      <div className={css['reject-button']}>
        <Button color="negative" onPress={onReject} size="sm" variant="border">
          <Icon icon={CrossIcon} />
          {t(['authenticated', 'controls', 'reject'])}
        </Button>
      </div>
    </div>
  )
}
