import { useGetPropertyTypes } from "@/components/item-form/use-property-types";
import type {
  PropertyTypeConcept,
  PropertyTypeScalar,
} from "@/lib/data/sshoc/api/property";
import type { ToolInput } from "@/lib/data/sshoc/api/tool-or-service";

const recommendedFields = {
  // label: '',
  // description: '',
  // version: '',
  contributors: [{ role: { code: undefined }, actor: { id: undefined } }],
  accessibleAt: [undefined],
  externalIds: [
    { identifier: undefined, identifierService: { code: undefined } },
  ],
  relatedItems: [{ relation: { code: undefined }, persistentId: undefined }],
};

const recommendedProperties = [
  "activity",
  "keyword",
  "discipline",
  "language",
  "tool-family",
  "service-type",
  "mode-of-use",
  "intended-audience",
  "see-also",
  "user-manual-url",
  "helpdesk-url",
  "license",
  "standard",
  "terms-of-use-url",
  "technical-readiness-level",
  "resource-category",
];

export function useToolFormRecommendedFields(): Partial<ToolInput> {
  const { data: propertyTypes } = useGetPropertyTypes();

  const properties: Array<
    | { type: PropertyTypeConcept; concept: { uri: undefined } }
    | { type: PropertyTypeScalar; value: undefined }
  > = [];

  recommendedProperties.forEach((id) => {
    const propertyType = propertyTypes?.[id];
    if (propertyType != null) {
      if (propertyType.type === "concept") {
        properties.push({ type: propertyType, concept: { uri: undefined } });
      } else {
        properties.push({ type: propertyType, value: undefined });
      }
    }
  });

  const fields = { ...recommendedFields, properties };

  return fields as unknown as Partial<ToolInput>;
}
