import type { ComponentPropsWithoutRef, Ref } from 'react'
import { forwardRef } from 'react'
import { useGetItemCategories } from '@/api/sshoc'
import type { ItemCategory } from '@/api/sshoc/types'
import UnreachableError from '@/utils/ts/UnreachableError'
import { Svg as DatasetIcon } from '@@/assets/icons/dataset.svg'
import { Svg as PublicationIcon } from '@@/assets/icons/publication.svg'
import { Svg as ToolOrServiceIcon } from '@@/assets/icons/tool-or-service.svg'
import { Svg as TrainingMaterialIcon } from '@@/assets/icons/training-material.svg'
import { Svg as WorkflowIcon } from '@@/assets/icons/workflow.svg'

type ItemCategoryIconProps = ComponentPropsWithoutRef<'svg'> & {
  category: Exclude<ItemCategory, 'step'>
}

const ItemCategoryIcon = forwardRef(function ItemCategoryIcon(
  { category, ...props }: ItemCategoryIconProps,
  ref: Ref<SVGSVGElement>,
): JSX.Element {
  const { data: itemCategories = {} } = useGetItemCategories()
  const title = itemCategories[category] as string | undefined

  switch (category) {
    case 'dataset':
      return <DatasetIcon ref={ref} title={title} {...props} />
    case 'publication':
      return <PublicationIcon ref={ref} title={title} {...props} />
    case 'tool-or-service':
      return <ToolOrServiceIcon ref={ref} title={title} {...props} />
    case 'training-material':
      return <TrainingMaterialIcon ref={ref} title={title} {...props} />
    case 'workflow':
      return <WorkflowIcon ref={ref} title={title} {...props} />
    default:
      throw new UnreachableError(category)
  }
})

export { ItemCategoryIcon }
