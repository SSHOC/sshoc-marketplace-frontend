import type {
  DatasetCore,
  PublicationCore,
  StepCore,
  ToolCore,
  TrainingMaterialCore,
  WorkflowCore,
} from '@/api/sshoc'

export function ensureIsoDates<
  T extends
    | DatasetCore
    | PublicationCore
    | StepCore
    | ToolCore
    | TrainingMaterialCore
    | WorkflowCore,
>(values: T): T {
  if ('dateCreated' in values) {
    if (values.dateCreated != null && values.dateCreated.length > 0) {
      values.dateCreated = new Date(values.dateCreated).toISOString()
    }
  }

  if ('dateLastUpdated' in values) {
    if (values.dateLastUpdated != null && values.dateLastUpdated.length > 0) {
      values.dateLastUpdated = new Date(values.dateLastUpdated).toISOString()
    }
  }

  return values
}
