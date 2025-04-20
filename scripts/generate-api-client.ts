import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { createUrl, log } from "@acdh-oeaw/lib";
import openapiTS, { astToString } from "openapi-typescript";
import * as ts from "typescript";

import { env } from "@/config/env.config";

const BLOB = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Blob"));
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull());

async function generate() {
	const url = createUrl({ baseUrl: env.NEXT_PUBLIC_API_BASE_URL, pathname: "/v3/api-docs" });

	const ast = await openapiTS(url, {
		alphabetize: true,
		arrayLength: true,
		defaultNonNullable: true,
		enumValues: true,
		exportType: false,
		immutable: false,
		pathParamsAsTypes: false, // TODO: try enabling
		/**
		 * In openapi, all properties are optional by default, which means properties, which are
		 * required or guaranteed to be present need to be explicitly marked as such, which the
		 * sshoc api does not do.
		 *
		 * Marking all properties as required is correct most of the time - we apply some fixes in
		 * `transform` below.
		 */
		propertiesRequiredByDefault: true,
		rootTypes: false,
		transform(schemaObject, _metadata) {
			if (schemaObject.format === "binary") {
				return schemaObject.nullable === true ? ts.factory.createUnionTypeNode([BLOB, NULL]) : BLOB;
			}

			return undefined;
		},
	});

	let contents = astToString(ast);

	/** @see https://github.com/openapi-ts/openapi-typescript/issues/2138 */
	contents = contents.replace(
		/ReadonlyArray<(paths.*?\["query"\])/g,
		"ReadonlyArray<NonNullable<$1>",
	);

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
