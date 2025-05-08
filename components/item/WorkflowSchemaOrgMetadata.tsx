import type { ReactNode } from "react";
import { JsonLd } from "react-schemaorg";

import { isPropertyConcept } from "@/data/sshoc/api/property";
import type { Workflow } from "@/data/sshoc/api/workflow";

export interface WorkflowSchemaOrgMetadataProps {
	workflow: Workflow;
}

export function WorkflowSchemaOrgMetadata(props: WorkflowSchemaOrgMetadataProps): ReactNode {
	const { workflow } = props;

	const conceptBasedProperties = workflow.properties.filter(isPropertyConcept);

	return (
		<JsonLd
			item={{
				"@context": "https://schema.org",
				"@type": "HowTo",
				headline: workflow.label,
				name: workflow.label,
				abstract: workflow.description,
				description: workflow.description,
				url: workflow.accessibleAt,
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
				version: workflow.version,
				contributor: workflow.contributors.map((contributor) => {
					return contributor.actor.name;
				}),
				inLanguage: conceptBasedProperties
					.filter((property) => {
						return property.type.code === "language";
					})
					.map((property) => {
						return property.concept.label;
					}),
				step: workflow.composedOf.map((step) => {
					return {
						"@type": "HowToStep" as const,
						headline: step.label,
						name: step.label,
						abstract: step.description,
						description: step.description,
					};
				}),
			}}
		/>
	);
}
