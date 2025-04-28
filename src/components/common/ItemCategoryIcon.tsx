import type { ItemCategoryWithWorkflowStep } from '@/data/sshoc/api/item'
import DatasetIcon from '~/public/assets/images/categories/dataset.svg?symbol-icon'
import PublicationIcon from '~/public/assets/images/categories/publication.svg?symbol-icon'
import WorkflowStepIcon from '~/public/assets/images/categories/step.svg?symbol-icon'
import ToolIcon from '~/public/assets/images/categories/tool-or-service.svg?symbol-icon'
import TrainingMaterialIcon from '~/public/assets/images/categories/training-material.svg?symbol-icon'
import WorkflowIcon from '~/public/assets/images/categories/workflow.svg?symbol-icon'

export interface ItemCategoryIconProps {
  category: ItemCategoryWithWorkflowStep
}

export function ItemCategoryIcon(props: ItemCategoryIconProps): JSX.Element {
  switch (props.category) {
    case 'dataset':
      return <DatasetIcon aria-hidden={true} width={40} height={40} />
    case 'publication':
      return <PublicationIcon aria-hidden={true} width={40} height={40} />
    case 'tool-or-service':
      return <ToolIcon aria-hidden={true} width={40} height={40} />
    case 'training-material':
      return <TrainingMaterialIcon aria-hidden={true} width={40} height={40} />
    case 'workflow':
      return <WorkflowIcon aria-hidden={true} width={40} height={40} />
    case 'step':
      return <WorkflowStepIcon aria-hidden={true} width={40} height={40} />
  }
}
