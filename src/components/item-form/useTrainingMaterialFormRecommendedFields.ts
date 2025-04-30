import type {
	PropertyType,
	PropertyTypeConcept,
	PropertyTypeScalar,
} from "@/data/sshoc/api/property";
import type { TrainingMaterialInput } from "@/data/sshoc/api/training-material";
import _propertyTypes from "~/public/data/property-types.json";

const propertyTypes = _propertyTypes as Record<PropertyType["code"], PropertyType>;

const recommendedFields = {
	// label: '',
	// description: '',
	contributors: [{ role: { code: undefined }, actor: { id: undefined } }],
	accessibleAt: [""],
	externalIds: [{ identifier: undefined, identifierService: { code: undefined } }],
	relatedItems: [{ relation: { code: undefined }, persistentId: undefined }],
};

const recommendedProperties = [
	"activity",
	"keyword",
	"discipline",
	"language",
	"intended-audience",
	"see-also",
	"license",
	"year",
	"resource-category",
];

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

export function useTrainingMaterialFormRecommendedFields(): Partial<TrainingMaterialInput> {
	return fields as unknown as Partial<TrainingMaterialInput>;
}
