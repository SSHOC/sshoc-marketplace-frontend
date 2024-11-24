import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { createUrl, log } from "@acdh-oeaw/lib";
import { writeFile } from "fs/promises";
import openapi, { astToString } from "openapi-typescript";

import { env } from "@/config/env.config";

async function generate() {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/v3/api-docs",
	});

	const ast = await openapi(url, {
		arrayLength: true,
	});

	const outputFolder = join(process.cwd(), "lib", "api");
	await mkdir(outputFolder, { recursive: true });
	const outputFilePath = join(outputFolder, "types.ts");

	const types = astToString(ast);

	await writeFile(outputFilePath, types, { encoding: "utf-8" });
}

generate()
	.then(() => {
		log.success("Successfully generated api client.");
	})
	.catch((error: unknown) => {
		log.error("Failed to generate api client.\n", String(error));
		process.exitCode = 1;
	});
