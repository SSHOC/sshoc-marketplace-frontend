import { SchemaOrg } from "@stefanprobst/next-page-metadata";
import type { ReactNode } from "react";

import { isPropertyConcept } from "@/data/sshoc/api/property";
import type { TrainingMaterial } from "@/data/sshoc/api/training-material";

export interface TrainingMaterialSchemaOrgMetadataProps {
	trainingMaterial: TrainingMaterial;
}

export function TrainingMaterialSchemaOrgMetadata(
	props: TrainingMaterialSchemaOrgMetadataProps,
): ReactNode {
	const { trainingMaterial } = props;

	const conceptBasedProperties = trainingMaterial.properties.filter(isPropertyConcept);

	return (
		<SchemaOrg
			schema={{
				"@type": "CreativeWork",
				headline: trainingMaterial.label,
				name: trainingMaterial.label,
				abstract: trainingMaterial.description,
				description: trainingMaterial.description,
				url: trainingMaterial.accessibleAt,
				about: conceptBasedProperties
					.filter((property) => {
						return property.type.code === "keyword";
					})
					.map((property) => {
						return property.concept.label;
					}),
				license: conceptBasedProperties
					.filter((property) => {
						return property.type.code === "license";
					})
					.map((property) => {
						return property.concept.label;
					}),
				version: trainingMaterial.version,
				contributor: trainingMaterial.contributors.map((contributor) => {
					return contributor.actor.name;
				}),
				dateCreated: trainingMaterial.dateCreated,
				dateModified: trainingMaterial.dateLastUpdated,
				inLanguage: conceptBasedProperties
					.filter((property) => {
						return property.type.code === "language";
					})
					.map((property) => {
						return property.concept.label;
					}),
			}}
		/>
	);
}
