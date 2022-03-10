import type { StaticResult as PropertyTypes } from '@/components/item-form/property-types.static'
import _propertyTypes from '@/components/item-form/property-types.static'
import type { PropertyTypeConcept, PropertyTypeScalar } from '@/data/sshoc/api/property'
import type { ToolInput } from '@/data/sshoc/api/tool-or-service'

const propertyTypes = _propertyTypes as unknown as PropertyTypes

const recommendedFields = {
  // label: '',
  // description: '',
  // version: '',
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
  'tool-family',
  'service-type',
  'mode-of-use',
  'intended-audience',
  'see-also',
  'user-manual-url',
  'helpdesk-url',
  'license',
  'standard',
  'terms-of-use-url',
  'technical-readiness-level',
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

export function useToolFormRecommendedFields(): Partial<ToolInput> {
  return fields as unknown as Partial<ToolInput>
}
