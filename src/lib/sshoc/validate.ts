import type {
  DatasetCore,
  PublicationCore,
  ToolCore,
  TrainingMaterialCore,
  WorkflowCore,
} from '@/api/sshoc'
import { isUrl } from '@/modules/form/validate'

export function validate<
  T extends
    | DatasetCore
    | PublicationCore
    | ToolCore
    | TrainingMaterialCore
    | WorkflowCore
>(
  values: Partial<T>,
  errors: Partial<Record<keyof typeof values, any>>,
): Partial<Record<keyof typeof values, any>> {
  /** Required field `label`. */
  if (values.label === undefined) {
    errors.label = 'Label is required.'
  }

  /** Required field `description`. */
  if (values.description === undefined) {
    errors.description = 'Description is required.'
  }

  /** Accesible at field must be a valid URL. */
  if (values.accessibleAt !== undefined) {
    values.accessibleAt.forEach((url, index) => {
      if (url !== undefined && !isUrl(url)) {
        if (errors.accessibleAt === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.accessibleAt = []
        }
        errors.accessibleAt[index] = 'Must be a valid URL.'
      }
    })
  }

  /** Required actor name when actor role is set. */
  if (values.contributors !== undefined) {
    values.contributors.forEach((contributor, index) => {
      if (
        contributor !== undefined &&
        contributor.role !== undefined &&
        contributor.actor === undefined
      ) {
        if (errors.contributors === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.contributors = []
        }
        errors.contributors[index] = {
          actor: { id: 'Please select a name.' },
        }
      }
    })
  }

  /** Required actor role when actor name is set. */
  if (values.contributors !== undefined) {
    values.contributors.forEach((contributor, index) => {
      if (
        contributor !== undefined &&
        contributor.actor !== undefined &&
        contributor.role === undefined
      ) {
        if (errors.contributors === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.contributors = []
        }
        errors.contributors[index] = {
          role: { code: 'Please select a role.' },
        }
      }
    })
  }

  /** Required property type when property value is set. */
  if (values.properties !== undefined) {
    values.properties.forEach((property, index) => {
      if (
        property.type === undefined &&
        (property.value !== undefined || property.concept !== undefined)
      ) {
        if (errors.properties === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.properties = []
        }
        errors.properties[index] = {
          type: { code: 'Please choose a concept.' },
        }
      }
    })
  }

  /** Required property value when property type is set. */
  if (values.properties !== undefined) {
    values.properties.forEach((property, index) => {
      if (
        property.type !== undefined &&
        property.value === undefined &&
        property.concept === undefined
      ) {
        if (errors.properties === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.properties = []
        }
        errors.properties[index] = {
          concept: 'Please choose a concept.',
          value: 'Please choose a value.',
        }
      }
    })
  }

  /** Required related item id when relation type is set. */
  if (values.relatedItems !== undefined) {
    values.relatedItems.forEach((item, index) => {
      if (item.relation !== undefined && item.objectId === undefined) {
        if (errors.relatedItems === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.relatedItems = []
        }
        errors.relatedItems[index] = { objectId: 'Please select an item.' }
      }
    })
  }

  /** Required relation type when related item id is set. */
  if (values.relatedItems !== undefined) {
    values.relatedItems.forEach((item, index) => {
      if (item.relation !== undefined && item.relation === undefined) {
        if (errors.relatedItems === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.relatedItems = []
        }
        errors.relatedItems[index] = {
          relation: 'Please select a relation type.',
        }
      }
    })
  }

  /** `sourceItemId` is required when `source` is set. */
  if (values.source?.id != null && values.sourceItemId == null) {
    errors.sourceItemId = 'Missing value in Source ID.'
  }

  /** `source` is required when `sourceItemId` is set. */
  if (values.sourceItemId != null && values.source?.id == null) {
    errors.sourceItemId = 'Missing value in Source.'
  }

  return errors
}
