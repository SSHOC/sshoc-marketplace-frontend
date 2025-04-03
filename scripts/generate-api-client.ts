import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { createUrl, log } from "@acdh-oeaw/lib";
import openapiTS, { astToString } from "openapi-typescript";
import * as ts from "typescript";

import { env } from "@/config/env.config";

const BLOB = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Blob")); // `Blob`
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull()); // `null`

async function generate() {
	const url = createUrl({ baseUrl: env.NEXT_PUBLIC_API_BASE_URL, pathname: "/v3/api-docs" });

	const ast = await openapiTS(url, {
		alphabetize: true,
		arrayLength: true,
		defaultNonNullable: true,
		propertiesRequiredByDefault: true,
		enumValues: true,
		exportType: false,
		immutable: false,
		pathParamsAsTypes: false, // TODO: try enabling
		rootTypes: false,
		transform(schemaObject, _metadata) {
			if (schemaObject.format === "binary") {
				return schemaObject.nullable ? ts.factory.createUnionTypeNode([BLOB, NULL]) : BLOB;
			}

			return undefined;
		},
	});

	const contents = astToString(ast);

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
