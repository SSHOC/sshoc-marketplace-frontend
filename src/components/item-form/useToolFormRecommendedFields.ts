import type {
	PropertyType,
	PropertyTypeConcept,
	PropertyTypeScalar,
} from "@/data/sshoc/api/property";
import type { ToolInput } from "@/data/sshoc/api/tool-or-service";
import _propertyTypes from "~/public/data/property-types.json";

const propertyTypes = _propertyTypes as Record<PropertyType["code"], PropertyType>;

const recommendedFields = {
	// label: '',
	// description: '',
	// version: '',
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
	"mode-of-use",
	"intended-audience",
	"see-also",
	"helpdesk-url",
	"license",
	"standard",
	"technical-readiness-level",
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

export function useToolFormRecommendedFields(): Partial<ToolInput> {
	return fields as unknown as Partial<ToolInput>;
}
