import type {
	PropertyType,
	PropertyTypeConcept,
	PropertyTypeScalar,
} from "@/data/sshoc/api/property";
import type { WorkflowStepInput } from "@/data/sshoc/api/workflow-step";
import _propertyTypes from "@/public/data/property-types.json";

const propertyTypes = _propertyTypes as Record<PropertyType["code"], PropertyType>;

const recommendedFields = {
	// label: '',
	// description: '',
	relatedItems: [{ relation: { code: undefined }, persistentId: undefined }],
};

const recommendedProperties = ["activity", "keyword", "inputformat", "outputformat"];

const properties: Array<
	| { type: PropertyTypeConcept; concept: { uri: undefined } }
	| { type: PropertyTypeScalar; value: undefined }
> = [];

recommendedProperties.forEach((id) => {
	const propertyType = propertyTypes[id];
	if (propertyType != null) {
		if (propertyType.type === "concept") {
			properties.push({ type: propertyType, concept: { uri: undefined } });
		} else {
			properties.push({ type: propertyType, value: undefined });
		}
	}
});

const fields = { ...recommendedFields, properties };

export function useWorkflowStepFormRecommendedFields(): Partial<WorkflowStepInput> {
	return fields as unknown as Partial<WorkflowStepInput>;
}
