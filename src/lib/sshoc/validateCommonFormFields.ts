import type {
  DatasetCore,
  PaginatedPropertyTypes,
  PublicationCore,
  ToolCore,
  TrainingMaterialCore,
  WorkflowCore,
} from '@/api/sshoc'
import { useGetPropertyTypes } from '@/api/sshoc'
import { isDate, isUrl } from '@/modules/form/validate'

export function validateCommonFormFields<
  T extends
    | DatasetCore
    | PublicationCore
    | ToolCore
    | TrainingMaterialCore
    | WorkflowCore
>(
  values: Partial<T>,
  errors: Partial<Record<keyof typeof values, any>>,
  propertyTypes?: Record<
    string,
    'string' | 'concept' | 'url' | 'int' | 'float' | 'date' | undefined
  >,
): void {
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (url != null && !isUrl(url)) {
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
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        contributor != null &&
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
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        contributor != null &&
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
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        property != null &&
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

  /** Valid property value. */
  if (values.properties !== undefined) {
    values.properties.forEach((property, index) => {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        property != null &&
        property.type !== undefined &&
        property.value !== undefined
      ) {
        const type =
          property.type.code != null &&
          propertyTypes != null &&
          propertyTypes[property.type.code]
        if (type != null) {
          if (
            (type === 'date' && !isDate(property.value)) ||
            (type === 'url' && !isUrl(property.value)) ||
            (type === 'int' && !Number.isInteger(Number(property.value))) ||
            (type === 'float' && !Number.isFinite(Number(property.value)))
          ) {
            if (errors.properties === undefined) {
              /* @ts-expect-error Untyped empty array. */
              errors.properties = []
            }
            errors.properties[index] = {
              value: `Value must be a valid ${type}.`,
            }
          }
        }
      }
    })
  }

  /** Required property value when property type is set. */
  if (values.properties !== undefined) {
    values.properties.forEach((property, index) => {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        property != null &&
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
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        item != null &&
        item.relation !== undefined &&
        item.persistentId === undefined
      ) {
        if (errors.relatedItems === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.relatedItems = []
        }
        errors.relatedItems[index] = { persistentId: 'Please select an item.' }
      }
    })
  }

  /** Required relation type when related item id is set. */
  if (values.relatedItems !== undefined) {
    values.relatedItems.forEach((item, index) => {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        item != null &&
        item.persistentId !== undefined &&
        item.relation === undefined
      ) {
        if (errors.relatedItems === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.relatedItems = []
        }
        errors.relatedItems[index] = {
          relation: { code: 'Please select a relation type.' },
        }
      }
    })
  }

  if (values.externalIds !== undefined) {
    values.externalIds.forEach((id, index) => {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        id != null &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        id.identifierService?.code != null &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        id.identifier == null
      ) {
        if (errors.externalIds === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.externalIds = []
        }
        errors.externalIds[index] = {
          identifier: 'ID is required.',
        }
      }
    })
  }

  if (values.externalIds !== undefined) {
    values.externalIds.forEach((id, index) => {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        id != null &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        id.identifier != null &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        id.identifierService?.code == null
      ) {
        if (errors.externalIds === undefined) {
          /* @ts-expect-error Untyped empty array. */
          errors.externalIds = []
        }
        errors.externalIds[index] = {
          identifierService: { code: 'Please select an ID service.' },
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
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useValidateCommonFormFields() {
  const propertyTypes = useGetPropertyTypes(
    { perpage: 100 },
    {
      select: mapPropertyTypes,
    },
  )

  function validate(
    values: Parameters<typeof validateCommonFormFields>[0],
    errors: Parameters<typeof validateCommonFormFields>[1],
  ) {
    return validateCommonFormFields(values, errors, propertyTypes.data as any)
  }

  return validate
}

function mapPropertyTypes(response: PaginatedPropertyTypes) {
  const map: Record<
    string,
    'string' | 'concept' | 'url' | 'int' | 'float' | 'date' | undefined
  > = {}
  response.propertyTypes?.forEach((propertyType) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const id = propertyType.code!
    map[id] = propertyType.type
  })
  return map
}
