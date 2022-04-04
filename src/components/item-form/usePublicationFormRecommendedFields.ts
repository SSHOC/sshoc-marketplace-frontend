import type { StaticResult as PropertyTypes } from '@/components/item-form/property-types.static'
import _propertyTypes from '@/components/item-form/property-types.static'
import type { PropertyTypeConcept, PropertyTypeScalar } from '@/data/sshoc/api/property'
import type { PublicationInput } from '@/data/sshoc/api/publication'

const propertyTypes = _propertyTypes as unknown as PropertyTypes

const recommendedFields = {
  // label: '',
  // description: '',
  contributors: [{ role: { code: undefined }, actor: { id: undefined } }],
  accessibleAt: [undefined],
  externalIds: [{ identifier: undefined, identifierService: { code: undefined } }],
  relatedItems: [{ relation: { code: undefined }, persistentId: undefined }],
}

const recommendedProperties = [
  'activity',
  'keyword',
  'discipline',
  'language',
  'extent',
  'intended-audience',
  'see-also',
  'license',
  'publication-type',
  'publisher',
  'publication-place',
  'year',
  'journal',
  'conference',
  'volume',
  'issue',
  'pages',
  'standard',
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

export function usePublicationFormRecommendedFields(): Partial<PublicationInput> {
  return fields as unknown as Partial<PublicationInput>
}
