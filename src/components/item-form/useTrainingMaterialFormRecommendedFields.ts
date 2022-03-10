import type { StaticResult as PropertyTypes } from '@/components/item-form/property-types.static'
import _propertyTypes from '@/components/item-form/property-types.static'
import type { PropertyTypeConcept, PropertyTypeScalar } from '@/data/sshoc/api/property'
import type { TrainingMaterialInput } from '@/data/sshoc/api/training-material'

const propertyTypes = _propertyTypes as unknown as PropertyTypes

const recommendedFields = {
  // label: '',
  // description: '',
  contributors: [undefined],
  accessibleAt: [undefined],
  externalIds: [undefined],
  relatedItems: [undefined],
}

const recommendedProperties = [
  'activity',
  'keyword',
  'discipline',
  'language',
  'object-format',
  'extent',
  'intended-audience',
  'see-also',
  'license',
  'standard',
  'terms-of-use-url',
  'year',
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

export function useTrainingMaterialFormRecommendedFields(): Partial<TrainingMaterialInput> {
  return fields as unknown as Partial<TrainingMaterialInput>
}
