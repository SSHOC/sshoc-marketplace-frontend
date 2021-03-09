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
    licenses: item.licenses, // deprecated?
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
     * `persistentId` => `objectId`
     */
    relatedItems: item.relatedItems?.map((relation) => {
      return {
        ...relation,
        objectId: relation.persistentId,
      }
    }),
    /**
     * Only ids needed. Also, fields are non-null.
     */
    externalIds: item.externalIds?.map((id) => {
      return {
        serviceIdentifier: id.identifierService?.code ?? '',
        identifier: id.identifier ?? '',
      }
    }),
    /**
     * Only id needed.
     */
    source: {
      id: item.source?.id,
    },
    sourceItemId: item.sourceItemId,
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
