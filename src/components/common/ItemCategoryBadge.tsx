import css from '@/components/common/ItemCategoryBadge.module.css'
import type { ItemCategoryWithWorkflowStep } from '@/data/sshoc/api/item'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface ItemCategoryBadgeProps {
  category: ItemCategoryWithWorkflowStep
}

export function ItemCategoryBadge(props: ItemCategoryBadgeProps): JSX.Element {
  const { t } = useI18n<'common'>()
  const { category } = props

  const label = t(['common', 'item-categories', category, 'one'])

  const className = `${css['badge']} ${css[category]}`

  return <span className={className}>{label}</span>
}
