import type {
  DatasetCore,
  DatasetDto,
  PublicationCore,
  PublicationDto,
  StepCore,
  StepDto,
  ToolCore,
  ToolDto,
  TrainingMaterialCore,
  TrainingMaterialDto,
  WorkflowCore,
  WorkflowDto,
} from '@/api/sshoc'
import type { Item } from '@/api/sshoc/types'
import allowedPropertyTypes from '@/utils/propertyTypes.preval'

export function convertToInitialFormValues(item: DatasetDto): DatasetCore
export function convertToInitialFormValues(
  item: PublicationDto,
): PublicationCore
export function convertToInitialFormValues(item: StepDto): StepCore
export function convertToInitialFormValues(item: ToolDto): ToolCore
export function convertToInitialFormValues(
  item: TrainingMaterialDto,
): TrainingMaterialCore
export function convertToInitialFormValues(item: WorkflowDto): WorkflowCore

/**
 * Converts item details into intitial form values,
 * i.e. `${ItemCategory}Dto` into `${ItemCategory}Core`.
 */
export function convertToInitialFormValues(
  item:
    | DatasetDto
    | PublicationDto
    | StepDto
    | ToolDto
    | TrainingMaterialDto
    | WorkflowDto,
): (
  | DatasetCore
  | PublicationCore
  | StepCore
  | ToolCore
  | TrainingMaterialCore
  | WorkflowCore
) & { persistentId?: string } {
  const initialValues = {
    label: item.label,
    version: item.version,
    description: item.description,
    accessibleAt: item.accessibleAt,
    /**
     * Only ids needed.
     */
    contributors: item.contributors?.map((contributor) => {
      const id = contributor.actor?.id
      const code = contributor.role?.code
      return { actor: { id }, role: { code } }
    }),
    /**
     * Only ids needed.
     */
    properties: item.properties?.map((property) => {
      return {
        // id: property.id, // this is in ItemDto but not in ItemCore
        type: { code: property.type?.code },
        value: property.value,
        concept: {
          code: property.concept?.code,
          vocabulary: { code: property.concept?.vocabulary?.code },
          uri: property.concept?.uri,
        },
      }
    }),
    /**
     * Only ids needed.
     */
    relatedItems: item.relatedItems?.map((relation) => {
      return {
        id: relation.id,
        persistentId: relation.persistentId,
        relation: relation.relation && { code: relation.relation.code },
      }
    }),
    /**
     * Only ids needed. Also, fields are non-null.
     */
    externalIds: item.externalIds?.map((id) => {
      const identifierService = { code: id.identifierService?.code }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const identifier = id.identifier!
      const externalId = {
        identifier,
        identifierService,
      }
      return externalId
    }),
    /**
     * Only id needed.
     */
    source: item.source && {
      id: item.source.id,
    },
    sourceItemId: item.sourceItemId,
    /**
     * Only id needed
     */
    thumbnail: item.thumbnail,
    /**
     * Only id needed, but keep additional info around - will be stripped in `sanitizeFormValues` before submit.
     */
    media: item.media,
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (['dataset', 'publication'].includes(item.category!)) {
    // @ts-expect-error items are not discriminated unions
    initialValues.dateCreated = item.dateCreated
    // @ts-expect-error items are not discriminated unions
    initialValues.dateLastUpdated = item.dateLastUpdated
  }

  if (item.category === 'workflow') {
    // @ts-expect-error items are not discriminated unions
    initialValues.composedOf = item.composedOf?.map((step) =>
      convertToInitialFormValues(step),
    )
  }

  if (item.category === 'step') {
    /** Keep id, so we can easily identify if a workflow step is edited or newly created. */
    // @ts-expect-error items are not discriminated unions
    initialValues.persistentId = item.persistentId
  }

  return initialValues
}

/**
 * Populates recommended form fields with empty values.
 */
export function createInitialRecommendedFields({
  required,
  recommended,
  recommendedProperties,
}: {
  required: Array<string>
  recommended: Array<string>
  recommendedProperties: Array<string>
}): Record<string, unknown> {
  const fieldTypes: Partial<Item> = {
    label: '',
    version: '',
    description: '',
    contributors: [{ role: { code: 'contributor' } }],
    accessibleAt: [''],

    externalIds: [{}],
    media: [],
    thumbnail: {},
    relatedItems: [{}],
  }

  const initialValues: any = {}

  ;(required as Array<keyof Item>).forEach((fieldName) => {
    initialValues[fieldName] = fieldTypes[fieldName]
  })
  ;(recommended as Array<keyof Item>).forEach((fieldName) => {
    initialValues[fieldName] = fieldTypes[fieldName]
  })

  initialValues.properties = []
  recommendedProperties
    .filter((id) => allowedPropertyTypes.includes(id))
    .forEach((id) => {
      initialValues.properties.push({ type: { code: id } })
    })

  return initialValues
}
