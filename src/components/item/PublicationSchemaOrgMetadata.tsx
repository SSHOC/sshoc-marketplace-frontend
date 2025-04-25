import { SchemaOrg } from "@stefanprobst/next-page-metadata";

import { isPropertyConcept } from "@/data/sshoc/api/property";
import type { Publication } from "@/data/sshoc/api/publication";

export interface PublicationSchemaOrgMetadataProps {
	publication: Publication;
}

export function PublicationSchemaOrgMetadata(
	props: PublicationSchemaOrgMetadataProps,
): JSX.Element {
	const { publication } = props;

	const conceptBasedProperties = publication.properties.filter(isPropertyConcept);

	return (
		<SchemaOrg
			schema={{
				"@type": "CreativeWork",
				headline: publication.label,
				name: publication.label,
				abstract: publication.description,
				description: publication.description,
				url: publication.accessibleAt,
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
				version: publication.version,
				contributor: publication.contributors.map((contributor) => {
					return contributor.actor.name;
				}),
				dateCreated: publication.dateCreated,
				dateModified: publication.dateLastUpdated,
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
