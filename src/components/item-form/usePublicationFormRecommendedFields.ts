import type { StaticResult as PropertyTypes } from '@/components/item-form/property-types.static'
import _propertyTypes from '@/components/item-form/property-types.static'
import type { PropertyType } from '@/data/sshoc/api/property'
import type { PublicationInput } from '@/data/sshoc/api/publication'

const propertyTypes = _propertyTypes as unknown as PropertyTypes

const recommendedFields = {
  label: '',
  description: '',
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

const properties: Array<PropertyType> = []

recommendedProperties.forEach((id) => {
  const propertyType = propertyTypes[id]
  if (propertyType != null) {
    properties.push(propertyType)
  }
})

const fields = { ...recommendedFields, properties }

export function usePublicationFormRecommendedFields(): Partial<PublicationInput> {
  return fields as unknown as Partial<PublicationInput>
}
