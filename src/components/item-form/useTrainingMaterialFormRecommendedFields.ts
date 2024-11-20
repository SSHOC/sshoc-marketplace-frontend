import { useGetPropertyTypes } from "@/components/item-form/use-property-types";
import type {
  PropertyTypeConcept,
  PropertyTypeScalar,
} from "@/lib/data/sshoc/api/property";
import type { TrainingMaterialInput } from "@/lib/data/sshoc/api/training-material";

const recommendedFields = {
  // label: '',
  // description: '',
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
  "object-format",
  "extent",
  "intended-audience",
  "see-also",
  "license",
  "standard",
  "terms-of-use-url",
  "year",
  "resource-category",
];

export function useTrainingMaterialFormRecommendedFields(): Partial<TrainingMaterialInput> {
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

  return fields as unknown as Partial<TrainingMaterialInput>;
}
