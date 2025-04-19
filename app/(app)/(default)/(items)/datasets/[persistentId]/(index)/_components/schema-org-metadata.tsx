import type { ReactNode } from "react";
import { jsonLdScriptProps } from "react-schemaorg";

import type { GetDataset } from "@/lib/api/client";

interface SchemaOrgMetadataProps {
	item: GetDataset.Response;
}

export function SchemaOrgMetadata(props: Readonly<SchemaOrgMetadataProps>): ReactNode {
	const { item } = props;

	const conceptBasedProperties = item.properties.filter((property) => {
		return property.type.type === "concept";
	});

	/** @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld */
	return (
		<script
			{...jsonLdScriptProps({
				"@context": "https://schema.org",
				"@type": "Dataset",
				name: item.label,
				description: item.description,
				headline: item.label,
				abstract: item.description,
				url: item.accessibleAt,
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
				version: item.version,
				contributor: item.contributors.map((contributor) => {
					return contributor.actor.name;
				}),
				dateCreated: item.dateCreated,
				dateModified: item.dateLastUpdated,
				inLanguage: conceptBasedProperties
					.filter((property) => {
						return property.type.code === "language";
					})
					.map((property) => {
						return property.concept.label;
					}),
			})}
		/>
	);
}
