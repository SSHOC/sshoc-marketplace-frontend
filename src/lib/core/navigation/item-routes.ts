import type { ItemCategory } from '@/data/sshoc/api/item'
import { routes } from '@/lib/core/navigation/routes'

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const itemRoutes = {
  ItemPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return routes.DatasetPage
      case 'publication':
        return routes.PublicationPage
      case 'tool-or-service':
        return routes.ToolOrServicePage
      case 'training-material':
        return routes.TrainingMaterialPage
      case 'workflow':
        return routes.WorkflowPage
    }
  },
  ItemVersionPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return routes.DatasetVersionPage
      case 'publication':
        return routes.PublicationVersionPage
      case 'tool-or-service':
        return routes.ToolOrServiceVersionPage
      case 'training-material':
        return routes.TrainingMaterialVersionPage
      case 'workflow':
        return routes.WorkflowVersionPage
    }
  },
  ItemHistoryPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return routes.DatasetHistoryPage
      case 'publication':
        return routes.PublicationHistoryPage
      case 'tool-or-service':
        return routes.ToolOrServiceHistoryPage
      case 'training-material':
        return routes.TrainingMaterialHistoryPage
      case 'workflow':
        return routes.WorkflowHistoryPage
    }
  },
  ItemCreatePage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return routes.CreateDatasetPage
      case 'publication':
        return routes.CreatePublicationPage
      case 'tool-or-service':
        return routes.CreateToolOrServicePage
      case 'training-material':
        return routes.CreateTrainingMaterialPage
      case 'workflow':
        return routes.CreateWorkflowPage
    }
  },
  ItemEditPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return routes.EditDatasetPage
      case 'publication':
        return routes.EditPublicationPage
      case 'tool-or-service':
        return routes.EditToolOrServicePage
      case 'training-material':
        return routes.EditTrainingMaterialPage
      case 'workflow':
        return routes.EditWorkflowPage
    }
  },
  ItemEditVersionPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return routes.EditDatasetVersionPage
      case 'publication':
        return routes.EditPublicationVersionPage
      case 'tool-or-service':
        return routes.EditToolOrServiceVersionPage
      case 'training-material':
        return routes.EditTrainingMaterialVersionPage
      case 'workflow':
        return routes.EditWorkflowVersionPage
    }
  },
  ItemReviewPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return routes.ReviewDatasetPage
      case 'publication':
        return routes.ReviewPublicationPage
      case 'tool-or-service':
        return routes.ReviewToolOrServicePage
      case 'training-material':
        return routes.ReviewTrainingMaterialPage
      case 'workflow':
        return routes.ReviewWorkflowPage
    }
  },
}
