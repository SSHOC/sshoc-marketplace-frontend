import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { getPropertyTypes } from "@/data/sshoc/api/property";
import { log, mapBy } from "@/lib/utils";

const outputFolderPath = join(process.cwd(), "public", "data");

async function generate() {
	await mkdir(outputFolderPath, { recursive: true });

	const { propertyTypes } = await getPropertyTypes({ perpage: 100 });

	const propertyTypesById = Object.fromEntries(mapBy(propertyTypes, "code"));

	await writeFile(
		join(outputFolderPath, "property-types.json"),
		JSON.stringify(propertyTypesById),
		{ encoding: "utf-8" },
	);
}

generate()
	.then(() => {
		log.success("Successfully generated static data.");
	})
	.catch((error: unknown) => {
		log.error("Failed to generate static data.\n", String(error));
		process.exitCode = 1;
	});
