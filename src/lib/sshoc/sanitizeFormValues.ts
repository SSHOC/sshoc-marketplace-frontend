import type {
  DatasetCore,
  PublicationCore,
  StepCore,
  ToolCore,
  TrainingMaterialCore,
  WorkflowCore,
} from '@/api/sshoc'

export function sanitizeFormValues<
  T extends
    | DatasetCore
    | PublicationCore
    | ToolCore
    | TrainingMaterialCore
    | WorkflowCore
    | StepCore
>(values: T): T {
  /**
   * Backend crashes with `[null]`
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  values.accessibleAt = values.accessibleAt?.filter((v) => v != null)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  values.contributors = values.contributors?.filter((v) => v != null)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  values.properties = values.properties?.filter((v) => v != null)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  values.relatedItems = values.relatedItems?.filter((v) => v != null)

  /**
   * Backend crashes with `source: {}`.
   */
  if (values.source && values.source.id === undefined) {
    delete values.source
  }

  return values
}