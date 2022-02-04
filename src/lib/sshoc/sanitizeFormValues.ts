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
  /* eslint-disable @typescript-eslint/no-unnecessary-condition */
  values.accessibleAt = values.accessibleAt?.filter(
    (v) => v != null && v.length > 0,
  )
  values.contributors = values.contributors?.filter(
    (v) => v != null && v.role != null && v.actor != null,
  )
  values.properties = values.properties?.filter(
    (v) =>
      v != null && v.type != null && (v.concept != null || v.value != null),
  )
  values.relatedItems = values.relatedItems?.filter(
    (v) => v != null && v.persistentId != null && v.relation != null,
  )
  values.externalIds = values.externalIds?.filter(
    (v) =>
      v != null &&
      v.identifier != null &&
      v.identifier.length > 0 &&
      v.identifierService != null,
  )
  /* eslint-enable @typescript-eslint/no-unnecessary-condition */

  /**
   * Backend crashes with `source: {}`.
   */
  if (values.source && values.source.id === undefined) {
    delete values.source
  }

  if (Array.isArray(values.media) && values.media.length > 0) {
    values.media = values.media.map((m) => ({
      caption: m.caption,
      info: { mediaId: m.info?.mediaId },
    }))
  }

  if (values.thumbnail != null && values.thumbnail.info?.mediaId != null) {
    values.thumbnail = { info: { mediaId: values.thumbnail.info.mediaId } }
  }

  /**
   * FIXME: Not 100% sure, but it sounds like we should not provide `source` and `sourceItemId`.
   * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/85#note_536637
   */
  delete values.source
  delete values.sourceItemId

  return values
}
