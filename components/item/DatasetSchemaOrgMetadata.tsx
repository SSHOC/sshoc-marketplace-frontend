import type { ReactNode } from "react";
import { JsonLd } from "react-schemaorg";

import type { Dataset } from "@/data/sshoc/api/dataset";
import { isPropertyConcept } from "@/data/sshoc/api/property";

export interface DatasetSchemaOrgMetadataProps {
	dataset: Dataset;
}

export function DatasetSchemaOrgMetadata(props: DatasetSchemaOrgMetadataProps): ReactNode {
	const { dataset } = props;

	const conceptBasedProperties = dataset.properties.filter(isPropertyConcept);

	return (
		<JsonLd
			item={{
				"@context": "https://schema.org",
				"@type": "Dataset",
				headline: dataset.label,
				name: dataset.label,
				abstract: dataset.description,
				description: dataset.description,
				url: dataset.accessibleAt,
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
				version: dataset.version,
				contributor: dataset.contributors.map((contributor) => {
					return contributor.actor.name;
				}),
				dateCreated: dataset.dateCreated,
				dateModified: dataset.dateLastUpdated,
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
