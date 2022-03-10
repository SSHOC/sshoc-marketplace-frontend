import type { StaticResult as PropertyTypes } from '@/components/item-form/property-types.static'
import _propertyTypes from '@/components/item-form/property-types.static'
import type { DatasetInput } from '@/data/sshoc/api/dataset'
import type { PropertyType } from '@/data/sshoc/api/property'

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
  'object-format',
  'extent',
  'intended-audience',
  'see-also',
  'license',
  'year',
  'standard',
  'publisher',
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

export function useDatasetFormRecommendedFields(): Partial<DatasetInput> {
  return fields as unknown as Partial<DatasetInput>
}
