import { useGetPropertyTypes } from "@/components/item-form/use-property-types";
import type {
  PropertyTypeConcept,
  PropertyTypeScalar,
} from "@/lib/data/sshoc/api/property";
import type { WorkflowStepInput } from "@/lib/data/sshoc/api/workflow-step";

const recommendedFields = {
  // label: '',
  // description: '',
  relatedItems: [{ relation: { code: undefined }, persistentId: undefined }],
};

const recommendedProperties = [
  "activity",
  "keyword",
  "inputformat",
  "outputformat",
];

export function useWorkflowStepFormRecommendedFields(): Partial<WorkflowStepInput> {
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

  return fields as unknown as Partial<WorkflowStepInput>;
}
