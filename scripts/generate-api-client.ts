import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { assert, createUrl, log, request } from "@acdh-oeaw/lib";
import openapiTS, { astToString, type OpenAPI3 } from "openapi-typescript";
import * as ts from "typescript";

import { env } from "@/config/env.config";

const BLOB = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Blob"));
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull());

async function generate() {
	const url = createUrl({ baseUrl: env.NEXT_PUBLIC_API_BASE_URL, pathname: "/v3/api-docs" });

	const schema = (await request(url, { responseType: "json" })) as OpenAPI3;

	/**
	 * In openapi schemas, object properties are optional by default - but the schema document
	 * provided by the backend does not correctly mark `required` fields.
	 */
	Object.entries(schema.components!.schemas!).forEach(([name, def]) => {
		switch (name) {
			case "ActorDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ActorExternalIdDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ActorHistoryDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ActorRoleDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ActorSourceDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ConceptBasicDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "DatasetDto": {
				assert(def.type === "object" && def.properties != null);

				const category = def.properties.category;
				assert(category != null && "type" in category && category.type === "string");
				category.enum = ["dataset"];

				const optional: Array<string> = ["thumbnail"];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = ["thumbnail"];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemBasicDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemCommentDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemContributorDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemsDifferencesDtoItemDtoItemDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemExtBasicDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemExternalIdDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemMediaDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemRelatedItemDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemRelationDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ItemSourceDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "MediaSourceDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PaginatedItemsBasicItemBasicDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PaginatedItemsBasicItemExtBasicDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PaginatedDatasets": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PaginatedPublications": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PaginatedSearchConcepts": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PaginatedSearchItems": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PaginatedSources": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PaginatedTools": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PaginatedTrainingMaterials": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PaginatedWorkflows": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PropertyDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PropertyTypeDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "PublicationDto": {
				assert(def.type === "object" && def.properties != null);

				const category = def.properties.category;
				assert(category != null && "type" in category && category.type === "string");
				category.enum = ["publication"];

				const optional: Array<string> = ["thumbnail"];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "RelatedItemDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "SearchConcept": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "SearchItem": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = ["thumbnailId"];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "SourceDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "SourceBasicDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "StepDto": {
				assert(def.type === "object" && def.properties != null);

				const category = def.properties.category;
				assert(category != null && "type" in category && category.type === "string");
				category.enum = ["step"];

				const optional: Array<string> = ["thumbnail"];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "SuggestedObject": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "SuggestedSearchPhrases": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "ToolDto": {
				assert(def.type === "object" && def.properties != null);

				const category = def.properties.category;
				assert(category != null && "type" in category && category.type === "string");
				category.enum = ["tool-or-service"];

				const optional: Array<string> = ["thumbnail"];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "TrainingMaterialDto": {
				assert(def.type === "object" && def.properties != null);

				const category = def.properties.category;
				assert(category != null && "type" in category && category.type === "string");
				category.enum = ["training-material"];

				const optional: Array<string> = ["thumbnail"];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "WorkflowDto": {
				assert(def.type === "object" && def.properties != null);

				const category = def.properties.category;
				assert(category != null && "type" in category && category.type === "string");
				category.enum = ["workflow"];

				const optional: Array<string> = ["thumbnail"];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "UserDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "VocabularyBasicDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			case "VocabularyDto": {
				assert(def.type === "object" && def.properties != null);

				const optional: Array<string> = [];
				def.required = Object.keys(def.properties).filter((field) => {
					return !optional.includes(field);
				});

				break;
			}

			default:
		}
	});

	const ast = await openapiTS(schema, {
		alphabetize: true,
		arrayLength: true,
		defaultNonNullable: true,
		enumValues: true,
		exportType: false,
		immutable: false,
		pathParamsAsTypes: false,
		rootTypes: false,
		transform(schemaObject, _metadata) {
			if (schemaObject.format === "binary") {
				return schemaObject.nullable === true ? ts.factory.createUnionTypeNode([BLOB, NULL]) : BLOB;
			}

			return undefined;
		},
	});

	const contents = astToString(ast)
		/** @see https://github.com/openapi-ts/openapi-typescript/issues/2138 */
		.replace(/ReadonlyArray<(paths.*?\["query"\])/g, "ReadonlyArray<NonNullable<$1>");

	const outputFilePath = join(process.cwd(), "lib", "api", "schema.ts");

	await writeFile(outputFilePath, contents, { encoding: "utf-8" });
}

generate()
	.then(() => {
		log.success("Successfully generated api client.");
	})
	.catch((error: unknown) => {
		log.error("Failed to generate api client.\n", String(error));
		process.exitCode = 1;
	});
