import type { StaticResult as PropertyTypes } from '@/components/item-form/property-types.static'
import _propertyTypes from '@/components/item-form/property-types.static'
import type { DatasetInput } from '@/data/sshoc/api/dataset'
import type { PropertyTypeConcept, PropertyTypeScalar } from '@/data/sshoc/api/property'

const propertyTypes = _propertyTypes as unknown as PropertyTypes

const recommendedFields = {
  // label: '',
  // description: '',
  contributors: [{ role: { code: undefined }, actor: { id: undefined } }],
  // accessibleAt: [undefined],
  externalIds: [{ identifier: undefined, identifierService: { code: undefined } }],
  relatedItems: [{ relation: { code: undefined }, persistentId: undefined }],
}

const recommendedProperties = [
  'activity',
  'keyword',
  'discipline',
  'language',
  'intended-audience',
  'see-also',
  'license',
  'year',
  'standard',
  'publisher',
  'resource-category',
]

const properties: Array<
  | { type: PropertyTypeConcept; concept: { uri: undefined } }
  | { type: PropertyTypeScalar; value: undefined }
> = []

recommendedProperties.forEach((id) => {
  const propertyType = propertyTypes[id]
  if (propertyType != null) {
    if (propertyType.type === 'concept') {
      properties.push({ type: propertyType, concept: { uri: undefined } })
    } else {
      properties.push({ type: propertyType, value: undefined })
    }
  }
})

const fields = { ...recommendedFields, properties }

export function useDatasetFormRecommendedFields(): Partial<DatasetInput> {
  return fields as unknown as Partial<DatasetInput>
}
