import type { StaticResult as PropertyTypes } from '@/components/item-form/property-types.static'
import _propertyTypes from '@/components/item-form/property-types.static'
import type { PropertyType } from '@/data/sshoc/api/property'
import type { WorkflowInput } from '@/data/sshoc/api/workflow'

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
  'intended-audience',
  'see-also',
  'license',
  'terms-of-use-url',
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

export function useWorkflowFormRecommendedFields(): Partial<WorkflowInput> {
  return fields as unknown as Partial<WorkflowInput>
}
