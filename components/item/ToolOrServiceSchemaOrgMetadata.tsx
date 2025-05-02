import { SchemaOrg } from "@stefanprobst/next-page-metadata";
import type { ReactNode } from "react";

import { isPropertyConcept } from "@/data/sshoc/api/property";
import type { Tool } from "@/data/sshoc/api/tool-or-service";

export interface ToolOrServiceSchemaOrgMetadataProps {
	toolOrService: Tool;
}

export function ToolOrServiceSchemaOrgMetadata(
	props: ToolOrServiceSchemaOrgMetadataProps,
): ReactNode {
	const { toolOrService: tool } = props;

	const conceptBasedProperties = tool.properties.filter(isPropertyConcept);

	return (
		<SchemaOrg
			schema={{
				"@type": "SoftwareApplication",
				headline: tool.label,
				name: tool.label,
				abstract: tool.description,
				description: tool.description,
				url: tool.accessibleAt,
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
				version: tool.version,
				contributor: tool.contributors.map((contributor) => {
					return contributor.actor.name;
				}),
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
