import type { ItemCategory as ItemCategoryWithStep } from '@/api/sshoc/types'

type ItemCategory = Exclude<ItemCategoryWithStep, 'step'>

/**
 * Returns item category in singular.
 *
 * Necessary because the backend only provides plural labels via GET items-categories.
 */
export function getSingularItemCategoryLabel(category: ItemCategory): string {
  const labels = {
    dataset: 'Dataset',
    publication: 'Publication',
    'tool-or-service': 'Tool or service',
    'training-material': 'Training material',
    workflow: 'Workflow',
  }
  return labels[category]
}
